import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Eye, EyeOff, Edit2, Settings, Trash2 } from 'lucide-react';
import { getFixtureNorms, getPipeTypesForMedia, getFixtureNvm } from '../lib/sanitary/dataLoader';
import { 
  calcSumNormal, 
  calcQ1, 
  calcProbableMaxFlow, 
  calcRequiredInnerDiameter_mm,
  selectPipeByInnerDiameter,
  calcDrainageMaxFlow,
  selectDrainDimensionBySlope,
  calcActualVelocity,
  getAvailableSlopes
} from '../lib/sanitary/reportMethod';

function SanitaryWater() {
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFixture, setEditingFixture] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  
  // Custom floor/zone inputs
  const [customFloor, setCustomFloor] = useState('');
  const [customZone, setCustomZone] = useState('');
  const [showCustomFloor, setShowCustomFloor] = useState(false);
  const [showCustomZone, setShowCustomZone] = useState(false);
  
  // Settings
  const [kvVelocity, setKvVelocity] = useState(1.5);
  const [vvVelocity, setVvVelocity] = useState(1.5);
  const [selectedKvPipeType, setSelectedKvPipeType] = useState('copper');
  const [selectedVvPipeType, setSelectedVvPipeType] = useState('copper');
  const [drainageSlope, setDrainageSlope] = useState('1:60');
  const [buildingType, setBuildingType] = useState('curveA');
  
  // New fixture form
  const [newFixture, setNewFixture] = useState({
    fixtureType: '',
    quantity: 1,
    floor: '',
    zone: '',
    excludedFromCalc: false
  });
  
  const fixtureNorms = getFixtureNorms();
  const baseFloors = ['Plan U2', 'Plan U1', 'Plan 01', 'Plan 02', 'Plan 03', 'Plan 04', 'Plan 05', 'Plan 06', 'Plan 07', 'Plan 08', 'Plan 09', 'Plan 10', 'Plan 11', 'Plan 12', 'Plan 13', 'Plan 14', 'Plan 15'];
  const baseZones = ['Sone A', 'Sone B', 'Sone C', 'Sone D', 'Sone E', 'Sone F', 'Sone G'];
  const availableSlopes = getAvailableSlopes();
  const kvPipeTypes = getPipeTypesForMedia('KV');
  const vvPipeTypes = getPipeTypesForMedia('VV');
  
  // Get unique floors and zones from fixtures + base options
  const allFloors = [...new Set([...baseFloors, ...fixtures.map(f => f.floor)])].sort();
  const allZones = [...new Set([...baseZones, ...fixtures.map(f => f.zone)])].sort();
  
  // Load fixtures from localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('eagleflow_current_user') || '{}');
    const savedProjects = JSON.parse(localStorage.getItem('eagleflow_projects') || '[]');
    const newlyCreatedId = localStorage.getItem('eagleflow_newly_created_project');
    const currentProject = savedProjects.find(p => p.id.toString() === newlyCreatedId || p.ownerId === currentUser.id);
    
    if (currentProject && currentProject.sanitaryFixtures) {
      setFixtures(currentProject.sanitaryFixtures);
    }
  }, []);
  
  const handleAddFixture = (e) => {
    e.preventDefault();
    
    const floorValue = showCustomFloor ? customFloor : newFixture.floor;
    const zoneValue = showCustomZone ? customZone : newFixture.zone;
    
    if (!newFixture.fixtureType || !floorValue || !zoneValue) {
      alert('Vennligst fyll ut alle felt');
      return;
    }
    
    const fixture = {
      id: Date.now(),
      fixtureType: newFixture.fixtureType,
      quantity: parseInt(newFixture.quantity) || 1,
      floor: floorValue,
      zone: zoneValue,
      excludedFromCalc: false
    };
    
    const updatedFixtures = [...fixtures, fixture];
    setFixtures(updatedFixtures);
    saveFixturesToProject(updatedFixtures);
    
    // Reset form
    setNewFixture({
      fixtureType: '',
      quantity: 1,
      floor: '',
      zone: '',
      excludedFromCalc: false
    });
    setCustomFloor('');
    setCustomZone('');
    setShowCustomFloor(false);
    setShowCustomZone(false);
    setShowAddModal(false);
  };
  
  const handleEditFixture = (e) => {
    e.preventDefault();
    
    const floorValue = showCustomFloor ? customFloor : editingFixture.floor;
    const zoneValue = showCustomZone ? customZone : editingFixture.zone;
    
    if (!editingFixture.fixtureType || !floorValue || !zoneValue) {
      alert('Vennligst fyll ut alle felt');
      return;
    }
    
    const updatedFixtures = fixtures.map(f =>
      f.id === editingFixture.id 
        ? { ...f, ...editingFixture, floor: floorValue, zone: zoneValue }
        : f
    );
    
    setFixtures(updatedFixtures);
    saveFixturesToProject(updatedFixtures);
    
    setShowEditModal(false);
    setEditingFixture(null);
    setCustomFloor('');
    setCustomZone('');
    setShowCustomFloor(false);
    setShowCustomZone(false);
  };
  
  const handleDeleteFixture = (fixtureId) => {
    if (confirm('Er du sikker på at du vil slette dette utstyret?')) {
      const updatedFixtures = fixtures.filter(f => f.id !== fixtureId);
      setFixtures(updatedFixtures);
      saveFixturesToProject(updatedFixtures);
    }
  };
  
  const openEditModal = (fixture) => {
    setEditingFixture({...fixture});
    setShowCustomFloor(!allFloors.includes(fixture.floor));
    setShowCustomZone(!allZones.includes(fixture.zone));
    if (!allFloors.includes(fixture.floor)) setCustomFloor(fixture.floor);
    if (!allZones.includes(fixture.zone)) setCustomZone(fixture.zone);
    setShowEditModal(true);
  };
  
  const toggleFixtureExclusion = (fixtureId) => {
    const updatedFixtures = fixtures.map(f =>
      f.id === fixtureId ? { ...f, excludedFromCalc: !f.excludedFromCalc } : f
    );
    setFixtures(updatedFixtures);
    saveFixturesToProject(updatedFixtures);
  };
  
  const saveFixturesToProject = (fixturesData) => {
    const currentUser = JSON.parse(localStorage.getItem('eagleflow_current_user') || '{}');
    const savedProjects = JSON.parse(localStorage.getItem('eagleflow_projects') || '[]');
    const newlyCreatedId = localStorage.getItem('eagleflow_newly_created_project');
    const currentProject = savedProjects.find(p => p.id.toString() === newlyCreatedId || p.ownerId === currentUser.id);
    
    if (currentProject) {
      currentProject.sanitaryFixtures = fixturesData;
      localStorage.setItem('eagleflow_projects', JSON.stringify(savedProjects));
    }
  };
  
  // Calculate results
  const getScopeFilter = () => {
    const filter = {};
    if (selectedFloor !== 'all') filter.floor = selectedFloor;
    if (selectedZone !== 'all') filter.zone = selectedZone;
    return filter;
  };
  
  const scopeFilter = getScopeFilter();
  
  // Kaldtvann calculations
  const Q_kv = calcSumNormal(fixtures, 'KV', scopeFilter);
  const q1_kv = calcQ1(fixtures, 'KV', scopeFilter);
  const q_kv = calcProbableMaxFlow(Q_kv, q1_kv);
  const requiredDi_kv = calcRequiredInnerDiameter_mm(q_kv, kvVelocity);
  const kvPipeType = kvPipeTypes.find(p => p.pipeType === selectedKvPipeType);
  const selectedKvDimension = kvPipeType ? selectPipeByInnerDiameter(kvPipeType.dimensions, requiredDi_kv) : null;
  const actualV_kv = selectedKvDimension ? calcActualVelocity(q_kv, selectedKvDimension.innerDiameter_mm) : 0;
  
  // Varmtvann calculations
  const Q_vv = calcSumNormal(fixtures, 'VV', scopeFilter);
  const q1_vv = calcQ1(fixtures, 'VV', scopeFilter);
  const q_vv = calcProbableMaxFlow(Q_vv, q1_vv);
  const requiredDi_vv = calcRequiredInnerDiameter_mm(q_vv, vvVelocity);
  const vvPipeType = vvPipeTypes.find(p => p.pipeType === selectedVvPipeType);
  const selectedVvDimension = vvPipeType ? selectPipeByInnerDiameter(vvPipeType.dimensions, requiredDi_vv) : null;
  const actualV_vv = selectedVvDimension ? calcActualVelocity(q_vv, selectedVvDimension.innerDiameter_mm) : 0;
  
  // Spillvann (drainage) calculations
  const Q_spill = calcSumNormal(fixtures, 'SPILL', scopeFilter);
  const q_spill = calcDrainageMaxFlow(Q_spill, buildingType);
  const selectedSpillDimension = selectDrainDimensionBySlope(drainageSlope, q_spill);
  
  // Group and sort fixtures by floor and zone
  const groupedFixtures = {};
  const filteredFixtures = fixtures.filter(f => {
    if (selectedFloor !== 'all' && f.floor !== selectedFloor) return false;
    if (selectedZone !== 'all' && f.zone !== selectedZone) return false;
    return true;
  });
  
  filteredFixtures.forEach(fixture => {
    const key = `${fixture.floor}|${fixture.zone}`;
    if (!groupedFixtures[key]) {
      groupedFixtures[key] = [];
    }
    groupedFixtures[key].push(fixture);
  });
  
  // Sort groups by floor then zone
  const sortedGroups = Object.keys(groupedFixtures).sort((a, b) => {
    const [floorA, zoneA] = a.split('|');
    const [floorB, zoneB] = b.split('|');
    if (floorA !== floorB)       return floorA.localeCompare(floorB);
    return zoneA.localeCompare(zoneB);
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Dimensjoner Sanitærledning</h1>
              <p className="text-sm text-teal-100">Kaldtvann, Varmtvann og Spillvann</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-bold text-gray-800 mb-4">Innstillinger</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* KV Settings */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kaldtvann Hastighet (m/s)</label>
                <input
                  type="number"
                  step="0.1"
                  value={kvVelocity}
                  onChange={(e) => setKvVelocity(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">Rørtype</label>
                <select
                  value={selectedKvPipeType}
                  onChange={(e) => setSelectedKvPipeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {kvPipeTypes.map(pt => (
                    <option key={pt.pipeType} value={pt.pipeType}>{pt.label}</option>
                  ))}
                </select>
              </div>
              
              {/* VV Settings */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Varmtvann Hastighet (m/s)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vvVelocity}
                  onChange={(e) => setVvVelocity(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">Rørtype</label>
                <select
                  value={selectedVvPipeType}
                  onChange={(e) => setSelectedVvPipeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {vvPipeTypes.map(pt => (
                    <option key={pt.pipeType} value={pt.pipeType}>{pt.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Drainage Settings */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Fall (Spillvann)</label>
                <select
                  value={drainageSlope}
                  onChange={(e) => setDrainageSlope(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {availableSlopes.map(slope => (
                    <option key={slope.key} value={slope.key}>{slope.label}</option>
                  ))}
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-2">Bygningstype</label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="curveA">Forretningsbygg (Kurve A)</option>
                  <option value="curveB">Boligbygg (Kurve B)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Scope Selector */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Filter Beregningsscope</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etasje</label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Alle etasjer</option>
                {allFloors.map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sone</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Alle soner</option>
                {allZones.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kaldtvann */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 shadow-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3 text-lg">Kaldtvann (KV)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Q (Sum Nvm):</span>
                <span className="font-semibold text-blue-800">{Q_kv.toFixed(3)} l/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">q₁ (Største):</span>
                <span className="font-semibold text-blue-800">{q1_kv.toFixed(3)} l/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">q (Maks sannsynlig):</span>
                <span className="font-semibold text-blue-900 text-base">{q_kv.toFixed(3)} l/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hastighet:</span>
                <span className="font-semibold text-blue-800">{kvVelocity} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Krevet Di:</span>
                <span className="font-semibold text-blue-800">{requiredDi_kv.toFixed(1)} mm</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Valgt dimensjon:</span>
                  <span className="font-bold text-blue-900">{selectedKvDimension?.label || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-600">Faktisk v:</span>
                  <span className="font-semibold text-blue-800">{actualV_kv.toFixed(2)} m/s</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Varmtvann */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 shadow-lg border border-orange-200">
            <h3 className="font-bold text-orange-900 mb-3 text-lg">Varmtvann (VV)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Q (Sum Nvm):</span>
                <span className="font-semibold text-orange-800">{Q_vv.toFixed(3)} l/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">q₁ (Største):</span>
                <span className="font-semibold text-orange-800">{q1_vv.toFixed(3)} l/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">q (Maks sannsynlig):</span>
                <span className="font-semibold text-orange-900 text-base">{q_vv.toFixed(3)} l/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hastighet:</span>
                <span className="font-semibold text-orange-800">{vvVelocity} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Krevet Di:</span>
                <span className="font-semibold text-orange-800">{requiredDi_vv.toFixed(1)} mm</span>
              </div>
              <div className="border-t border-orange-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Valgt dimensjon:</span>
                  <span className="font-bold text-orange-900">{selectedVvDimension?.label || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-600">Faktisk v:</span>
                  <span className="font-semibold text-orange-800">{actualV_vv.toFixed(2)} m/s</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Spillvann */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 shadow-lg border border-green-200">
            <h3 className="font-bold text-green-900 mb-3 text-lg">Spillvann (AV)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Q (Sum normal):</span>
                <span className="font-semibold text-green-800">{Q_spill.toFixed(3)} l/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">q (Maks sannsynlig):</span>
                <span className="font-semibold text-green-900 text-base">{q_spill.toFixed(3)} l/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fall:</span>
                <span className="font-semibold text-green-800">{drainageSlope}</span>
              </div>
              <div className="border-t border-green-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Valgt dimensjon:</span>
                  <span className="font-bold text-green-900">Ø{selectedSpillDimension?.nominalDiameter_mm || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-600">Kapasitet:</span>
                  <span className="font-semibold text-green-800">{selectedSpillDimension?.qMax_lps.toFixed(2) || 'N/A'} l/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixtures List - Grouped by Floor and Zone */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Sanitærutstyr</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Legg til</span>
            </button>
          </div>
          
          {fixtures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Ingen utstyr lagt til ennå</p>
              <p className="text-sm mt-2">Klikk "Legg til" for å legge til sanitærutstyr</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedGroups.map(groupKey => {
                const [floor, zone] = groupKey.split('|');
                const groupFixtures = groupedFixtures[groupKey];
                
                return (
                  <div key={groupKey} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Group Header */}
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 font-semibold">
                      {floor} - {zone}
                    </div>
                    
                    {/* Group Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Utstyr</th>
                            <th className="px-3 py-2 text-center font-semibold text-gray-700">Antall</th>
                            <th className="px-3 py-2 text-center font-semibold text-gray-700">KV</th>
                            <th className="px-3 py-2 text-center font-semibold text-gray-700">VV</th>
                            <th className="px-3 py-2 text-center font-semibold text-gray-700">Spill</th>
                            <th className="px-3 py-2 text-center font-semibold text-gray-700">Handlinger</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupFixtures.map((fixture) => {
                            const norm = fixtureNorms.find(n => n.fixtureType === fixture.fixtureType);
                            const isExcluded = fixture.excludedFromCalc;
                            return (
                              <tr key={fixture.id} className={`border-b border-gray-100 hover:bg-gray-50 ${isExcluded ? 'opacity-40' : ''}`}>
                                <td className="px-3 py-2">{norm?.label || fixture.fixtureType}</td>
                                <td className="px-3 py-2 text-center">{fixture.quantity}</td>
                                <td className="px-3 py-2 text-center text-xs">{(norm?.q1_kv_lps * fixture.quantity || 0).toFixed(2)}</td>
                                <td className="px-3 py-2 text-center text-xs">{(norm?.q1_vv_lps * fixture.quantity || 0).toFixed(2)}</td>
                                <td className="px-3 py-2 text-center text-xs">{(norm?.nvm_spill_lps * fixture.quantity || 0).toFixed(2)}</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => openEditModal(fixture)}
                                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                                      title="Rediger"
                                    >
                                      <Edit2 className="w-4 h-4 text-blue-600" />
                                    </button>
                                    <button
                                      onClick={() => toggleFixtureExclusion(fixture.id)}
                                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                                      title={isExcluded ? "Inkluder i beregning" : "Ekskluder fra beregning"}
                                    >
                                      {isExcluded ? (
                                        <EyeOff className="w-4 h-4 text-gray-400" />
                                      ) : (
                                        <Eye className="w-4 h-4 text-teal-600" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFixture(fixture.id)}
                                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                                      title="Slett"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Fixture Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Legg til utstyr</h3>
            <form onSubmit={handleAddFixture} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utstyr</label>
                <select
                  value={newFixture.fixtureType}
                  onChange={(e) => setNewFixture({...newFixture, fixtureType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Velg utstyr</option>
                  {fixtureNorms.map(norm => (
                    <option key={norm.fixtureType} value={norm.fixtureType}>{norm.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etasje</label>
                <select
                  value={showCustomFloor ? '---custom---' : newFixture.floor}
                  onChange={(e) => {
                    if (e.target.value === '---custom---') {
                      setShowCustomFloor(true);
                      setNewFixture({...newFixture, floor: ''});
                    } else {
                      setShowCustomFloor(false);
                      setNewFixture({...newFixture, floor: e.target.value});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required={!showCustomFloor}
                >
                  <option value="">Velg etasje</option>
                  {allFloors.map(floor => (
                    <option key={floor} value={floor}>{floor}</option>
                  ))}
                  <option value="---custom---">--- Egendefinert ---</option>
                </select>
                {showCustomFloor && (
                  <input
                    type="text"
                    value={customFloor}
                    onChange={(e) => setCustomFloor(e.target.value)}
                    placeholder="Skriv inn egendefinert etasje"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                    required
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sone</label>
                <select
                  value={showCustomZone ? '---custom---' : newFixture.zone}
                  onChange={(e) => {
                    if (e.target.value === '---custom---') {
                      setShowCustomZone(true);
                      setNewFixture({...newFixture, zone: ''});
                    } else {
                      setShowCustomZone(false);
                      setNewFixture({...newFixture, zone: e.target.value});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required={!showCustomZone}
                >
                  <option value="">Velg sone</option>
                  {allZones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                  <option value="---custom---">--- Egendefinert ---</option>
                </select>
                {showCustomZone && (
                  <input
                    type="text"
                    value={customZone}
                    onChange={(e) => setCustomZone(e.target.value)}
                    placeholder="Skriv inn egendefinert sone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                    required
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Antall</label>
                <input
                  type="number"
                  min="1"
                  value={newFixture.quantity}
                  onChange={(e) => setNewFixture({...newFixture, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowCustomFloor(false);
                    setShowCustomZone(false);
                    setCustomFloor('');
                    setCustomZone('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Legg til
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Fixture Modal */}
      {showEditModal && editingFixture && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Rediger utstyr</h3>
            <form onSubmit={handleEditFixture} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utstyr</label>
                <select
                  value={editingFixture.fixtureType}
                  onChange={(e) => setEditingFixture({...editingFixture, fixtureType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Velg utstyr</option>
                  {fixtureNorms.map(norm => (
                    <option key={norm.fixtureType} value={norm.fixtureType}>{norm.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etasje</label>
                <select
                  value={showCustomFloor ? '---custom---' : editingFixture.floor}
                  onChange={(e) => {
                    if (e.target.value === '---custom---') {
                      setShowCustomFloor(true);
                      setCustomFloor(editingFixture.floor);
                    } else {
                      setShowCustomFloor(false);
                      setEditingFixture({...editingFixture, floor: e.target.value});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required={!showCustomFloor}
                >
                  <option value="">Velg etasje</option>
                  {allFloors.map(floor => (
                    <option key={floor} value={floor}>{floor}</option>
                  ))}
                  <option value="---custom---">--- Egendefinert ---</option>
                </select>
                {showCustomFloor && (
                  <input
                    type="text"
                    value={customFloor}
                    onChange={(e) => setCustomFloor(e.target.value)}
                    placeholder="Skriv inn egendefinert etasje"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                    required
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sone</label>
                <select
                  value={showCustomZone ? '---custom---' : editingFixture.zone}
                  onChange={(e) => {
                    if (e.target.value === '---custom---') {
                      setShowCustomZone(true);
                      setCustomZone(editingFixture.zone);
                    } else {
                      setShowCustomZone(false);
                      setEditingFixture({...editingFixture, zone: e.target.value});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required={!showCustomZone}
                >
                  <option value="">Velg sone</option>
                  {allZones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                  <option value="---custom---">--- Egendefinert ---</option>
                </select>
                {showCustomZone && (
                  <input
                    type="text"
                    value={customZone}
                    onChange={(e) => setCustomZone(e.target.value)}
                    placeholder="Skriv inn egendefinert sone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                    required
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Antall</label>
                <input
                  type="number"
                  min="1"
                  value={editingFixture.quantity}
                  onChange={(e) => setEditingFixture({...editingFixture, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingFixture(null);
                    setShowCustomFloor(false);
                    setShowCustomZone(false);
                    setCustomFloor('');
                    setCustomZone('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lagre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SanitaryWater;
