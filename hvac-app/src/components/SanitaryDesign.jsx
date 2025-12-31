import React, { useState, useEffect } from 'react';
import { BarChart3, Droplets, Thermometer, Wind, CheckSquare, Settings, LogOut, ChevronLeft, Wrench, User, Plus, Trash2, Edit2, Save, X, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getOrInitSanitaryData, saveSanitaryData } from '../lib/sanitary/storage';
import { getFixtureNorms, getPipeTypesForMedia, getPipeCatalog } from '../lib/sanitary/dataLoader';
import { dimensionAllSegmentsBottomUp, groupFixturesByFloorZone } from '../lib/sanitary/calculations';

function SanitaryDesign() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Sanitär data
  const [sanitaryData, setSanitaryData] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [segments, setSegments] = useState([]);
  const [simultaneityFactor, setSimultaneityFactor] = useState(0.5);
  
  // UI state
  const [activeTab, setActiveTab] = useState('fixtures'); // 'fixtures', 'segments', 'results'
  const [showFixtureModal, setShowFixtureModal] = useState(false);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [editingFixture, setEditingFixture] = useState(null);
  const [editingSegment, setEditingSegment] = useState(null);
  
  // Results
  const [results, setResults] = useState([]);
  const [calculationError, setCalculationError] = useState(null);

  // Check for logged-in user
  useEffect(() => {
    const loggedInUser = localStorage.getItem('eagleflow_current_user');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Load selected project
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('eagleflow_projects') || '[]');
    const currentUserData = JSON.parse(localStorage.getItem('eagleflow_current_user') || '{}');
    
    // Find user's projects
    const userProjects = projects.filter(p => 
      p.ownerId === currentUserData.id || 
      (p.members && p.members.some(m => m.email === currentUserData.email && m.status === 'accepted'))
    );
    
    // Try to get the last selected project or first available
    if (userProjects.length > 0) {
      setSelectedProject(userProjects[0]);
    }
  }, [currentUser]);

  // Load sanitär data when project is selected
  useEffect(() => {
    if (selectedProject) {
      const data = getOrInitSanitaryData(selectedProject.id);
      setSanitaryData(data);
      setFixtures(data.fixtures || []);
      setSegments(data.segments || []);
      setSimultaneityFactor(data.simultaneityFactor || 0.5);
    }
  }, [selectedProject]);

  // Save data whenever it changes
  useEffect(() => {
    if (selectedProject && sanitaryData) {
      const updatedData = {
        ...sanitaryData,
        fixtures,
        segments,
        simultaneityFactor
      };
      saveSanitaryData(selectedProject.id, updatedData);
    }
  }, [fixtures, segments, simultaneityFactor, selectedProject, sanitaryData]);

  const handleLogout = () => {
    localStorage.removeItem('eagleflow_current_user');
    navigate('/login');
  };

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', active: false, path: '/dashboard' },
    { icon: Droplets, label: 'Sanitær', active: true, path: '/sanitary' },
    { icon: Thermometer, label: 'Varme/Kjøling', active: false, path: '#' },
    { icon: Wind, label: 'Ventilasjon', active: false, path: '#' },
    { icon: CheckSquare, label: 'Oppgaver', active: false, path: '#' },
    { icon: Settings, label: 'Innstillinger', active: false, path: '#' },
  ];

  // Fixture CRUD
  const handleAddFixture = (fixtureData) => {
    const newFixture = {
      id: Date.now().toString(),
      ...fixtureData
    };
    setFixtures([...fixtures, newFixture]);
    setShowFixtureModal(false);
    setEditingFixture(null);
  };

  const handleUpdateFixture = (fixtureData) => {
    setFixtures(fixtures.map(f => f.id === editingFixture.id ? { ...f, ...fixtureData } : f));
    setShowFixtureModal(false);
    setEditingFixture(null);
  };

  const handleDeleteFixture = (id) => {
    if (confirm('Er du sikker på at du vil slette dette utstyret?')) {
      setFixtures(fixtures.filter(f => f.id !== id));
    }
  };

  // Segment CRUD
  const handleAddSegment = (segmentData) => {
    const newSegment = {
      id: Date.now().toString(),
      ...segmentData
    };
    setSegments([...segments, newSegment]);
    setShowSegmentModal(false);
    setEditingSegment(null);
  };

  const handleUpdateSegment = (segmentData) => {
    setSegments(segments.map(s => s.id === editingSegment.id ? { ...s, ...segmentData } : s));
    setShowSegmentModal(false);
    setEditingSegment(null);
  };

  const handleDeleteSegment = (id) => {
    if (confirm('Er du sikker på at du vil slette denne rørstrekningen?')) {
      setSegments(segments.filter(s => s.id !== id));
      // Also remove fixtures connected to this segment
      setFixtures(fixtures.map(f => f.segmentId === id ? { ...f, segmentId: '' } : f));
    }
  };

  // Calculate results
  const handleCalculate = () => {
    setCalculationError(null);
    
    try {
      const fixtureNorms = getFixtureNorms();
      const normsById = {};
      fixtureNorms.forEach(n => { normsById[n.fixtureType] = n; });
      
      const pipeCatalog = getPipeCatalog();
      
      const { results: calcResults, hasCycle } = dimensionAllSegmentsBottomUp(segments, {
        fixtures,
        normsById,
        pipeCatalog,
        k: simultaneityFactor
      });
      
      if (hasCycle) {
        setCalculationError('Feil: Syklus oppdaget i rørnettverket. Sjekk parent-child relasjoner.');
        setResults([]);
      } else {
        setResults(calcResults);
        setActiveTab('results');
      }
    } catch (error) {
      setCalculationError(`Beregningsfeil: ${error.message}`);
      setResults([]);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-gray-200 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingen prosjekt valgt</h2>
          <p className="text-gray-600 mb-6">
            Du må velge et prosjekt før du kan bruke sanitærdimensjonering.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Gå til Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const userInitials = currentUser.firstName && currentUser.lastName 
    ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}` 
    : currentUser.email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 flex">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-80'
        } bg-gradient-to-b from-teal-800 to-teal-900 text-white shadow-2xl flex flex-col transition-all duration-300 relative`}
      >
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-4 top-6 w-8 h-8 bg-teal-700 hover:bg-teal-600 rounded-full flex items-center justify-center shadow-lg z-20 transition-all duration-200"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className={`p-6 border-b border-teal-700 ${sidebarCollapsed ? 'items-center' : ''}`}>
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  {currentUser.profileImage ? (
                    <img src={currentUser.profileImage} alt="Profilbilde" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{currentUser.firstName} {currentUser.lastName}</h3>
                  <p className="text-teal-300 text-sm">{currentUser.position}</p>
                </div>
                <Link
                  to="/profile-settings"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                  title="Innstillinger"
                >
                  <Wrench className="w-5 h-5 text-teal-300 group-hover:text-white transition-colors" />
                </Link>
              </div>
              <div className="bg-teal-700/50 rounded-lg p-3 flex items-center gap-2">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-teal-300">Prosjekt</p>
                  <p className="font-bold text-sm">{selectedProject.name}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {currentUser.profileImage ? (
                  <img src={currentUser.profileImage} alt="Profilbilde" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? 'bg-teal-700 text-white shadow-lg'
                    : 'hover:bg-teal-700/50 text-teal-100'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-teal-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-center gap-2'} px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-lg group relative`}
            title={sidebarCollapsed ? 'Logg ut' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-medium">Logg ut</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Sanitærdimensjonering</h1>
                  <p className="text-gray-600">Dimensjoner sanitæranlegg etter norske standarder</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Samtidigfaktor (k)</p>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="2"
                    value={simultaneityFactor}
                    onChange={(e) => setSimultaneityFactor(parseFloat(e.target.value) || 0.5)}
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-bold"
                  />
                </div>
                <button
                  onClick={handleCalculate}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg"
                >
                  Beregn
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-8 flex gap-4 border-t border-gray-200">
            <button
              onClick={() => setActiveTab('fixtures')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'fixtures'
                  ? 'text-teal-700 border-b-2 border-teal-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sanitærutstyr ({fixtures.length})
            </button>
            <button
              onClick={() => setActiveTab('segments')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'segments'
                  ? 'text-teal-700 border-b-2 border-teal-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Rørstrekninger ({segments.length})
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'results'
                  ? 'text-teal-700 border-b-2 border-teal-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Resultater ({results.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {calculationError && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span>{calculationError}</span>
            </div>
          )}

          {activeTab === 'fixtures' && (
            <FixturesTab
              fixtures={fixtures}
              segments={segments}
              onAdd={() => { setEditingFixture(null); setShowFixtureModal(true); }}
              onEdit={(fixture) => { setEditingFixture(fixture); setShowFixtureModal(true); }}
              onDelete={handleDeleteFixture}
            />
          )}

          {activeTab === 'segments' && (
            <SegmentsTab
              segments={segments}
              onAdd={() => { setEditingSegment(null); setShowSegmentModal(true); }}
              onEdit={(segment) => { setEditingSegment(segment); setShowSegmentModal(true); }}
              onDelete={handleDeleteSegment}
            />
          )}

          {activeTab === 'results' && (
            <ResultsTab
              results={results}
              segments={segments}
              fixtures={fixtures}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showFixtureModal && (
        <FixtureModal
          fixture={editingFixture}
          segments={segments}
          onSave={editingFixture ? handleUpdateFixture : handleAddFixture}
          onClose={() => { setShowFixtureModal(false); setEditingFixture(null); }}
        />
      )}

      {showSegmentModal && (
        <SegmentModal
          segment={editingSegment}
          segments={segments}
          onSave={editingSegment ? handleUpdateSegment : handleAddSegment}
          onClose={() => { setShowSegmentModal(false); setEditingSegment(null); }}
        />
      )}
    </div>
  );
}

// Fixtures Tab Component
function FixturesTab({ fixtures, segments, onAdd, onEdit, onDelete }) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sanitærutstyr</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Legg til utstyr
        </button>
      </div>

      {fixtures.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Droplets className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Ingen sanitærutstyr lagt til ennå</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Antall</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Vanntype</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Etasje</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Sone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rørstrekning</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {fixtures.map((fixture) => {
                const segment = segments.find(s => s.id === fixture.segmentId);
                return (
                  <tr key={fixture.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{fixture.fixtureType}</td>
                    <td className="py-3 px-4">{fixture.quantity}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        fixture.waterType === 'KV' ? 'bg-blue-100 text-blue-700' :
                        fixture.waterType === 'VV' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {fixture.waterType}
                      </span>
                    </td>
                    <td className="py-3 px-4">{fixture.floor}</td>
                    <td className="py-3 px-4">{fixture.zone}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{segment ? segment.id : '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(fixture)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(fixture.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Segments Tab Component
function SegmentsTab({ segments, onAdd, onEdit, onDelete }) {
  const getSegmentHierarchy = () => {
    const segmentsById = {};
    segments.forEach(s => { segmentsById[s.id] = { ...s, children: [] }; });
    
    const roots = [];
    segments.forEach(s => {
      if (s.parentId && segmentsById[s.parentId]) {
        segmentsById[s.parentId].children.push(segmentsById[s.id]);
      } else {
        roots.push(segmentsById[s.id]);
      }
    });
    
    return roots;
  };

  const renderSegmentTree = (segment, level = 0) => {
    return (
      <React.Fragment key={segment.id}>
        <tr className="border-b border-gray-100 hover:bg-gray-50">
          <td className="py-3 px-4" style={{ paddingLeft: `${level * 2 + 1}rem` }}>
            {level > 0 && <span className="text-gray-400 mr-2">└─</span>}
            {segment.id}
          </td>
          <td className="py-3 px-4">{segment.length} m</td>
          <td className="py-3 px-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              segment.mediaType === 'KV' ? 'bg-blue-100 text-blue-700' :
              segment.mediaType === 'VV' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {segment.mediaType}
            </span>
          </td>
          <td className="py-3 px-4 text-sm">{segment.pipeType}</td>
          <td className="py-3 px-4">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => onEdit(segment)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(segment.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
        {segment.children && segment.children.map(child => renderSegmentTree(child, level + 1))}
      </React.Fragment>
    );
  };

  const hierarchy = getSegmentHierarchy();

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Rørstrekninger</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Legg til rørstrekning
        </button>
      </div>

      {segments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Droplets className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Ingen rørstrekninger lagt til ennå</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Lengde</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Medietype</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rørtype</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {hierarchy.map(segment => renderSegmentTree(segment))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Results Tab Component
function ResultsTab({ results, segments, fixtures }) {
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterZone, setFilterZone] = useState('all');

  const floors = [...new Set(fixtures.map(f => f.floor))].sort((a, b) => a - b);
  const zones = [...new Set(fixtures.map(f => f.zone))].sort();

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Beregningsresultater</h2>
        
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm text-gray-600 mr-2">Etasje:</label>
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Alle</option>
              {floors.map(f => <option key={f} value={f}>Etasje {f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">Sone:</label>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Alle</option>
              {zones.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Ingen resultater ennå. Klikk "Beregn" for å dimensjonere rørstrekninger.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rørstrekning</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Belastning</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Dim. vannmengde</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Valgt dimensjon</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Hastighet</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Trykktap</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const segment = segments.find(s => s.id === result.segmentId);
                if (!segment) return null;

                return (
                  <tr key={result.segmentId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{result.segmentId}</td>
                    <td className="py-3 px-4">{result.totalLoadUnits.toFixed(1)}</td>
                    <td className="py-3 px-4">{result.designFlow_lps.toFixed(2)} l/s</td>
                    <td className="py-3 px-4">
                      {result.selectedDimension ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                          {result.selectedDimension.label}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                          Ingen
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {result.velocity_mps !== null ? `${result.velocity_mps.toFixed(2)} m/s` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {result.pressureDrop_kPa !== null ? `${result.pressureDrop_kPa.toFixed(1)} kPa` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Fixture Modal Component
function FixtureModal({ fixture, segments, onSave, onClose }) {
  const fixtureNorms = getFixtureNorms();
  const [formData, setFormData] = useState(fixture || {
    fixtureType: fixtureNorms[0]?.fixtureType || '',
    quantity: 1,
    waterType: 'KV',
    floor: 1,
    zone: 'Sone A',
    segmentId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {fixture ? 'Rediger utstyr' : 'Legg til utstyr'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
              <select
                value={formData.fixtureType}
                onChange={(e) => setFormData({ ...formData, fixtureType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
                required
              >
                {fixtureNorms.map(norm => (
                  <option key={norm.fixtureType} value={norm.fixtureType}>{norm.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Antall *</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vanntype *</label>
              <select
                value={formData.waterType}
                onChange={(e) => setFormData({ ...formData, waterType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
                required
              >
                <option value="KV">Kaldtvann (KV)</option>
                <option value="VV">Varmtvann (VV)</option>
                <option value="BOTH">Begge</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Etasje *</label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sone *</label>
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rørstrekning</label>
              <select
                value={formData.segmentId}
                onChange={(e) => setFormData({ ...formData, segmentId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
              >
                <option value="">Ingen</option>
                {segments.map(seg => (
                  <option key={seg.id} value={seg.id}>{seg.id} ({seg.mediaType})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Lagre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Segment Modal Component
function SegmentModal({ segment, segments, onSave, onClose }) {
  const [formData, setFormData] = useState(segment || {
    id: `SEG-${Date.now()}`,
    parentId: null,
    length: 10,
    mediaType: 'KV',
    pipeType: 'pex_sanipex'
  });

  const pipeTypes = getPipeTypesForMedia(formData.mediaType);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {segment ? 'Rediger rørstrekning' : 'Legg til rørstrekning'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID *</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
                required
                disabled={!!segment}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Parent ID</label>
              <select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
              >
                <option value="">Ingen (rot)</option>
                {segments.filter(s => s.id !== formData.id).map(seg => (
                  <option key={seg.id} value={seg.id}>{seg.id}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lengde (m) *</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) || 1 })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Medietype *</label>
              <select
                value={formData.mediaType}
                onChange={(e) => setFormData({ ...formData, mediaType: e.target.value, pipeType: '' })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
                required
              >
                <option value="KV">Kaldtvann (KV)</option>
                <option value="VV">Varmtvann (VV)</option>
                <option value="AV">Avløp (AV)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rørtype *</label>
              <select
                value={formData.pipeType}
                onChange={(e) => setFormData({ ...formData, pipeType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:outline-none"
                required
              >
                <option value="">Velg rørtype</option>
                {pipeTypes.map(pt => (
                  <option key={pt.pipeType} value={pt.pipeType}>{pt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Lagre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SanitaryDesign;
