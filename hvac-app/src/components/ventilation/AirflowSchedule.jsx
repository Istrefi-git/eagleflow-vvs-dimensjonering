import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp, Info } from 'lucide-react';
import {
  loadAirflowSchedule,
  saveAirflowSchedule,
  initAirflowSchedule,
  addRow,
  updateRow,
  deleteRow,
  getDefaultGlobals
} from '../../lib/ventilation/airflowStorage';
import {
  calcRoomRow,
  calcSums,
  groupBySystem
} from '../../lib/ventilation/airflowCalculations';

function AirflowSchedule() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [showGlobalsModal, setShowGlobalsModal] = useState(false);
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [expandedSystems, setExpandedSystems] = useState({});
  const [systemType, setSystemType] = useState('VAV'); // 'VAV' eller 'CAV'
  const [tek17Calculated, setTek17Calculated] = useState(0);
  
  // Form state for new/edit row
  const [formData, setFormData] = useState({
    plan: '',
    romnr: '',
    areal_m2: '',
    romnavn: '',
    personer: '',
    prosess_m3h: '',
    kravspek_m3h_per_m2: '',
    valgtTilluft_m3h: '',
    valgtAvtrekk_m3h: '',
    systemnr: '',
    vavMaks_m3h: '',
    cavKonstant_m3h: '',
    kommentar: '',
    systemType: 'VAV'
  });

  // Load selected project and data
  useEffect(() => {
    const projectsStr = localStorage.getItem('eagleflow_projects');
    const currentUserStr = localStorage.getItem('eagleflow_current_user');
    
    if (!currentUserStr) {
      navigate('/login');
      return;
    }
    
    if (projectsStr) {
      const projects = JSON.parse(projectsStr);
      const currentUser = JSON.parse(currentUserStr);
      
      // Find user's projects
      const userProjects = projects.filter(p => 
        p.ownerId === currentUser.id || 
        (p.members && p.members.some(m => m.email === currentUser.email && m.status === 'accepted'))
      );
      
      // Try to get last selected project from sessionStorage
      const lastProjectId = sessionStorage.getItem('eagleflow_last_selected_project');
      let project = null;
      
      if (lastProjectId) {
        project = userProjects.find(p => p.id.toString() === lastProjectId);
      }
      
      if (!project && userProjects.length > 0) {
        project = userProjects[0];
      }
      
      if (project) {
        setSelectedProject(project);
        const airflowData = initAirflowSchedule(project.id);
        setData(airflowData);
      }
    }
  }, [navigate]);

  // Calculate derived fields for all rows
  const rowsWithCalculations = data?.rows.map(row => ({
    ...row,
    calculated: calcRoomRow(row, data.globals)
  })) || [];

  const sums = calcSums(rowsWithCalculations);
  const systemGroups = groupBySystem(rowsWithCalculations);

  // Get unique values from existing rows for dropdowns
  const getUniqueValues = (field) => {
    if (!data?.rows) return [];
    const values = data.rows.map(row => row[field]).filter(v => v && v.trim() !== '');
    return [...new Set(values)].sort();
  };

  const uniquePlans = getUniqueValues('plan');
  const uniqueRomnr = getUniqueValues('romnr');
  const uniqueRomnavn = getUniqueValues('romnavn');
  const uniqueSystemnr = getUniqueValues('systemnr');

  // Calculate TEK17 when form values change
  useEffect(() => {
    if (data && (formData.areal_m2 || formData.personer || formData.prosess_m3h)) {
      const areal = parseFloat(formData.areal_m2) || 0;
      const personer = parseInt(formData.personer) || 0;
      const prosess = parseFloat(formData.prosess_m3h) || 0;
      
      if (prosess > 0) {
        setTek17Calculated(prosess);
      } else {
        const tek17 = (areal * data.globals.A_m3h_per_m2) + (personer * data.globals.B_m3h_per_person);
        setTek17Calculated(tek17);
      }
    }
  }, [formData.areal_m2, formData.personer, formData.prosess_m3h, data]);

  const handleAddRow = (e) => {
    e.preventDefault();
    
    if (!selectedProject) {
      alert('Vennligst velg et prosjekt');
      return;
    }
    
    const newRow = {
      plan: formData.plan,
      romnr: formData.romnr,
      areal_m2: parseFloat(formData.areal_m2) || 0,
      romnavn: formData.romnavn,
      personer: parseInt(formData.personer) || 0,
      prosess_m3h: parseFloat(formData.prosess_m3h) || 0,
      kravspek_m3h_per_m2: parseFloat(formData.kravspek_m3h_per_m2) || 0,
      valgtTilluft_m3h: parseFloat(formData.valgtTilluft_m3h) || 0,
      valgtAvtrekk_m3h: parseFloat(formData.valgtAvtrekk_m3h) || 0,
      systemnr: formData.systemnr,
      vavMaks_m3h: parseFloat(formData.vavMaks_m3h) || 0,
      cavKonstant_m3h: parseFloat(formData.cavKonstant_m3h) || 0,
      kommentar: formData.kommentar,
      systemType: formData.systemType
    };
    
    const added = addRow(selectedProject.id, newRow);
    if (added) {
      const updatedData = loadAirflowSchedule(selectedProject.id);
      setData(updatedData);
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleEditRow = (row) => {
    setEditingRow(row);
    setFormData({
      plan: row.plan || '',
      romnr: row.romnr || '',
      areal_m2: row.areal_m2 || '',
      romnavn: row.romnavn || '',
      personer: row.personer || '',
      prosess_m3h: row.prosess_m3h || '',
      kravspek_m3h_per_m2: row.kravspek_m3h_per_m2 || '',
      valgtTilluft_m3h: row.valgtTilluft_m3h || '',
      valgtAvtrekk_m3h: row.valgtAvtrekk_m3h || '',
      systemnr: row.systemnr || '',
      vavMaks_m3h: row.vavMaks_m3h || '',
      cavKonstant_m3h: row.cavKonstant_m3h || '',
      kommentar: row.kommentar || '',
      systemType: row.systemType || 'VAV'
    });
    setShowEditModal(true);
  };

  const handleUpdateRow = (e) => {
    e.preventDefault();
    
    if (!selectedProject || !editingRow) return;
    
    const updates = {
      plan: formData.plan,
      romnr: formData.romnr,
      areal_m2: parseFloat(formData.areal_m2) || 0,
      romnavn: formData.romnavn,
      personer: parseInt(formData.personer) || 0,
      prosess_m3h: parseFloat(formData.prosess_m3h) || 0,
      kravspek_m3h_per_m2: parseFloat(formData.kravspek_m3h_per_m2) || 0,
      valgtTilluft_m3h: parseFloat(formData.valgtTilluft_m3h) || 0,
      valgtAvtrekk_m3h: parseFloat(formData.valgtAvtrekk_m3h) || 0,
      systemnr: formData.systemnr,
      vavMaks_m3h: parseFloat(formData.vavMaks_m3h) || 0,
      cavKonstant_m3h: parseFloat(formData.cavKonstant_m3h) || 0,
      kommentar: formData.kommentar,
      systemType: formData.systemType
    };
    
    if (updateRow(selectedProject.id, editingRow.id, updates)) {
      const updatedData = loadAirflowSchedule(selectedProject.id);
      setData(updatedData);
      setShowEditModal(false);
      setEditingRow(null);
      resetForm();
    }
  };

  const handleDeleteRow = (rowId) => {
    if (!selectedProject) return;
    
    if (window.confirm('Er du sikker på at du vil slette denne raden?')) {
      if (deleteRow(selectedProject.id, rowId)) {
        const updatedData = loadAirflowSchedule(selectedProject.id);
        setData(updatedData);
      }
    }
  };

  const handleUpdateGlobals = (newGlobals) => {
    if (!selectedProject || !data) return;
    
    const updatedData = {
      ...data,
      globals: { ...data.globals, ...newGlobals },
      lastModified: new Date().toISOString()
    };
    
    if (saveAirflowSchedule(selectedProject.id, updatedData)) {
      setData(updatedData);
      setShowGlobalsModal(false);
    }
  };

  const handleUpdateMeta = (newMeta) => {
    if (!selectedProject || !data) return;
    
    const updatedData = {
      ...data,
      meta: { ...data.meta, ...newMeta },
      lastModified: new Date().toISOString()
    };
    
    if (saveAirflowSchedule(selectedProject.id, updatedData)) {
      setData(updatedData);
      setShowMetaModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      plan: '',
      romnr: '',
      areal_m2: '',
      romnavn: '',
      personer: '',
      prosess_m3h: '',
      kravspek_m3h_per_m2: '',
      valgtTilluft_m3h: '',
      valgtAvtrekk_m3h: '',
      systemnr: '',
      vavMaks_m3h: '',
      cavKonstant_m3h: '',
      kommentar: '',
      systemType: 'VAV'
    });
    setTek17Calculated(0);
  };

  const toggleSystem = (systemnr) => {
    setExpandedSystems(prev => ({
      ...prev,
      [systemnr]: !prev[systemnr]
    }));
  };

  if (!selectedProject || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Vennligst velg et prosjekt fra Dashboard</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Gå til Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-teal-800">Luftmengdeskjema</h1>
                <p className="text-gray-600 mt-1">{selectedProject.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMetaModal(true)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
              >
                <Info className="w-5 h-5 inline mr-2" />
                Prosjektinfo
              </button>
              <button
                onClick={() => setShowGlobalsModal(true)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
              >
                Konstanter
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Legg til rom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Globals Display */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Generelle forutsetninger</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-gray-600">A:</span>
              <span className="font-semibold ml-2">{data.globals.A_m3h_per_m2} m³/h/m²</span>
            </div>
            <div>
              <span className="text-gray-600">B:</span>
              <span className="font-semibold ml-2">{data.globals.B_m3h_per_person} m³/h/pers</span>
            </div>
            <div>
              <span className="text-gray-600">VAV-min:</span>
              <span className="font-semibold ml-2">{data.globals.vavMinFactor}</span>
            </div>
            <div>
              <span className="text-gray-600">T tilluft:</span>
              <span className="font-semibold ml-2">{data.globals.tTilluft_C}°C</span>
            </div>
            <div>
              <span className="text-gray-600">T avtrekk:</span>
              <span className="font-semibold ml-2">{data.globals.tAvtrekk_C}°C</span>
            </div>
          </div>
        </div>

        {/* Room Rows - Mobile Friendly Cards */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-bold text-gray-900">Romlinjer</h3>
          
          {rowsWithCalculations.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-gray-200">
              <p className="text-gray-500 mb-4">Ingen romlinjer lagt til ennå</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Legg til første rom
              </button>
            </div>
          ) : (
            <>
              {rowsWithCalculations.map((row, index) => (
                <div key={row.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {row.romnavn || `Rom ${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {row.plan && `Plan: ${row.plan}`} {row.romnr && `• Rom nr: ${row.romnr}`}
                        {row.systemnr && ` • System: ${row.systemnr}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRow(row)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Areal:</span>
                      <span className="font-semibold ml-2">{row.areal_m2} m²</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Personer:</span>
                      <span className="font-semibold ml-2">{row.personer}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">TEK17:</span>
                      <span className="font-semibold ml-2">{row.calculated.tek17Forelopig_m3h.toFixed(1)} m³/h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valgt tilluft:</span>
                      <span className="font-semibold ml-2">{row.valgtTilluft_m3h} m³/h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valgt avtrekk:</span>
                      <span className="font-semibold ml-2">{row.calculated.valgtAvtrekk_m3h} m³/h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">VAV min:</span>
                      <span className="font-semibold ml-2">{row.calculated.vavMin_m3h.toFixed(1)} m³/h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Kjøleeffekt:</span>
                      <span className="font-semibold ml-2">{row.calculated.kjoleeffekt_W.toFixed(0)} W</span>
                    </div>
                    {row.calculated.kontroll_m3h_per_m2 !== null && (
                      <div>
                        <span className="text-gray-600">Kontroll:</span>
                        <span className="font-semibold ml-2">{row.calculated.kontroll_m3h_per_m2.toFixed(2)} m³/h/m²</span>
                      </div>
                    )}
                  </div>
                  
                  {row.kommentar && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-gray-600 text-sm">Kommentar: </span>
                      <span className="text-gray-800 text-sm">{row.kommentar}</span>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Sums */}
        {rowsWithCalculations.length > 0 && (
          <div className="bg-teal-50 rounded-xl p-6 shadow-lg border border-teal-200 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Summer</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Totalt areal:</span>
                <span className="font-semibold ml-2">{sums.areal_m2.toFixed(1)} m²</span>
              </div>
              <div>
                <span className="text-gray-600">Totalt personer:</span>
                <span className="font-semibold ml-2">{sums.personer}</span>
              </div>
              <div>
                <span className="text-gray-600">Sum TEK17:</span>
                <span className="font-semibold ml-2">{sums.tek17Forelopig_m3h.toFixed(1)} m³/h</span>
              </div>
              <div>
                <span className="text-gray-600">Sum tilluft:</span>
                <span className="font-semibold ml-2">{sums.valgtTilluft_m3h.toFixed(1)} m³/h</span>
              </div>
              <div>
                <span className="text-gray-600">Sum avtrekk:</span>
                <span className="font-semibold ml-2">{sums.valgtAvtrekk_m3h.toFixed(1)} m³/h</span>
              </div>
              <div>
                <span className="text-gray-600">Sum VAV min:</span>
                <span className="font-semibold ml-2">{sums.vavMin_m3h.toFixed(1)} m³/h</span>
              </div>
            </div>
          </div>
        )}

        {/* System Groups */}
        {systemGroups.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Sum Ventilasjonssystem</h3>
            <div className="space-y-2">
              {systemGroups.map(system => (
                <div key={system.systemnr} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleSystem(system.systemnr)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">System: {system.systemnr}</span>
                    {expandedSystems[system.systemnr] ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  
                  {expandedSystems[system.systemnr] && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Tilluft:</span>
                          <span className="font-semibold ml-2">{system.tilluft_m3h.toFixed(1)} m³/h</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avtrekk:</span>
                          <span className="font-semibold ml-2">{system.avtrekk_m3h.toFixed(1)} m³/h</span>
                        </div>
                        <div>
                          <span className="text-gray-600">VAV min:</span>
                          <span className="font-semibold ml-2">{system.vavMin_m3h.toFixed(1)} m³/h</span>
                        </div>
                        <div>
                          <span className="text-gray-600">CAV konstant:</span>
                          <span className="font-semibold ml-2">{system.cavKonstant_m3h.toFixed(1)} m³/h</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {showEditModal ? 'Rediger rom' : 'Legg til rom'}
              </h2>
              <button
                onClick={() => {
                  showEditModal ? setShowEditModal(false) : setShowAddModal(false);
                  resetForm();
                  setEditingRow(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={showEditModal ? handleUpdateRow : handleAddRow} className="space-y-4">
              {/* System Type Selection */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Anleggstype</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="systemType"
                      value="VAV"
                      checked={formData.systemType === 'VAV'}
                      onChange={(e) => setFormData({...formData, systemType: e.target.value})}
                      className="mr-2"
                    />
                    <span className="font-medium">VAV (Variabelt luftmengde)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="systemType"
                      value="CAV"
                      checked={formData.systemType === 'CAV'}
                      onChange={(e) => setFormData({...formData, systemType: e.target.value})}
                      className="mr-2"
                    />
                    <span className="font-medium">CAV (Konstant luftmengde)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plan</label>
                  <input
                    type="text"
                    list="planList"
                    value={formData.plan}
                    onChange={(e) => setFormData({...formData, plan: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                  <datalist id="planList">
                    {uniquePlans.map((plan, idx) => (
                      <option key={idx} value={plan} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rom nr</label>
                  <input
                    type="text"
                    list="romnrList"
                    value={formData.romnr}
                    onChange={(e) => setFormData({...formData, romnr: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                  <datalist id="romnrList">
                    {uniqueRomnr.map((romnr, idx) => (
                      <option key={idx} value={romnr} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Areal (m²) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.areal_m2}
                    onChange={(e) => setFormData({...formData, areal_m2: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Romnavn *</label>
                  <input
                    type="text"
                    list="romnavnList"
                    value={formData.romnavn}
                    onChange={(e) => setFormData({...formData, romnavn: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    required
                  />
                  <datalist id="romnavnList">
                    {uniqueRomnavn.map((romnavn, idx) => (
                      <option key={idx} value={romnavn} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Personer</label>
                  <input
                    type="number"
                    value={formData.personer}
                    onChange={(e) => setFormData({...formData, personer: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prosessluft (C) (m³/h)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.prosess_m3h}
                    onChange={(e) => setFormData({...formData, prosess_m3h: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Kravspek luftmengde (m³/h/m²)
                    <div className="group relative">
                      <Info className="w-4 h-4 text-blue-500 cursor-help" />
                      <div className="hidden group-hover:block absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                        Hvis prosjektets kravspesifikasjon krever en minimumsluftmengde pr kvadrat skal denne benyttes her.
                      </div>
                    </div>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.kravspek_m3h_per_m2}
                    onChange={(e) => setFormData({...formData, kravspek_m3h_per_m2: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                {/* TEK17 Calculated Display */}
                <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">TEK17 Anbefalt luftmengde:</span>
                    <span className="text-lg font-bold text-teal-600">{tek17Calculated.toFixed(1)} m³/h</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Basert på areal, personer og prosessluft</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Valgt tilluft (m³/h)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.valgtTilluft_m3h}
                    onChange={(e) => setFormData({...formData, valgtTilluft_m3h: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    placeholder={tek17Calculated > 0 ? `Anbefalt: ${tek17Calculated.toFixed(1)}` : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Valgt avtrekk (m³/h)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.valgtAvtrekk_m3h}
                    onChange={(e) => setFormData({...formData, valgtAvtrekk_m3h: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Systemnr</label>
                  <input
                    type="text"
                    list="systemnrList"
                    value={formData.systemnr}
                    onChange={(e) => setFormData({...formData, systemnr: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                  <datalist id="systemnrList">
                    {uniqueSystemnr.map((systemnr, idx) => (
                      <option key={idx} value={systemnr} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    VAV maks (m³/h)
                    {formData.systemType === 'CAV' && <span className="text-xs text-gray-500 ml-2">(deaktivert for CAV)</span>}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.vavMaks_m3h}
                    onChange={(e) => setFormData({...formData, vavMaks_m3h: e.target.value})}
                    disabled={formData.systemType === 'CAV'}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent ${formData.systemType === 'CAV' ? 'bg-gray-100 text-gray-400' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CAV konstant (m³/h)
                    {formData.systemType === 'VAV' && <span className="text-xs text-gray-500 ml-2">(deaktivert for VAV)</span>}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.cavKonstant_m3h}
                    onChange={(e) => setFormData({...formData, cavKonstant_m3h: e.target.value})}
                    disabled={formData.systemType === 'VAV'}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent ${formData.systemType === 'VAV' ? 'bg-gray-100 text-gray-400' : ''}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kommentar</label>
                  <textarea
                    value={formData.kommentar}
                    onChange={(e) => setFormData({...formData, kommentar: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    showEditModal ? setShowEditModal(false) : setShowAddModal(false);
                    resetForm();
                    setEditingRow(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  <Save className="w-5 h-5 inline mr-2" />
                  {showEditModal ? 'Lagre endringer' : 'Legg til'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Globals Modal */}
      {showGlobalsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Generelle konstanter</h2>
              <button
                onClick={() => setShowGlobalsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdateGlobals({
                A_m3h_per_m2: parseFloat(formData.get('A')) || 3.6,
                B_m3h_per_person: parseFloat(formData.get('B')) || 26,
                vavMinFactor: parseFloat(formData.get('vavMinFactor')) || 0.2,
                tTilluft_C: parseFloat(formData.get('tTilluft')) || 18,
                tAvtrekk_C: parseFloat(formData.get('tAvtrekk')) || 26
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">A (m³/h/m²)</label>
                <input
                  type="number"
                  name="A"
                  step="0.1"
                  defaultValue={data.globals.A_m3h_per_m2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Ventilasjon for materialer (TEK17)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">B (m³/h/pers)</label>
                <input
                  type="number"
                  name="B"
                  step="0.1"
                  defaultValue={data.globals.B_m3h_per_person}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Ventilasjon for personer (TEK17)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">VAV-min faktor</label>
                <input
                  type="number"
                  name="vavMinFactor"
                  step="0.01"
                  defaultValue={data.globals.vavMinFactor}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Faktor for VAV minimum (typisk 0.2)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">T tilluft (°C)</label>
                <input
                  type="number"
                  name="tTilluft"
                  step="0.1"
                  defaultValue={data.globals.tTilluft_C}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Tillufttemperatur for kjøleeffektberegning</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">T avtrekk (°C)</label>
                <input
                  type="number"
                  name="tAvtrekk"
                  step="0.1"
                  defaultValue={data.globals.tAvtrekk_C}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Avtrekkstemperatur for kjøleeffektberegning</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGlobalsModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  <Save className="w-5 h-5 inline mr-2" />
                  Lagre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meta Modal */}
      {showMetaModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Prosjektinformasjon</h2>
              <button
                onClick={() => setShowMetaModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdateMeta({
                prosjektNavn: formData.get('prosjektNavn') || '',
                ordreNr: formData.get('ordreNr') || '',
                anleggOmrade: formData.get('anleggOmrade') || '',
                revisjonsDato: formData.get('revisjonsDato') || '',
                utfortAv: formData.get('utfortAv') || '',
                utfortDato: formData.get('utfortDato') || '',
                notater: formData.get('notater') || ''
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prosjektnavn</label>
                <input
                  type="text"
                  name="prosjektNavn"
                  defaultValue={data.meta.prosjektNavn}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ordre nr</label>
                  <input
                    type="text"
                    name="ordreNr"
                    defaultValue={data.meta.ordreNr}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Anlegg/Bygg/Område</label>
                  <input
                    type="text"
                    name="anleggOmrade"
                    defaultValue={data.meta.anleggOmrade}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Utført av</label>
                  <input
                    type="text"
                    name="utfortAv"
                    defaultValue={data.meta.utfortAv}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Utført dato</label>
                  <input
                    type="date"
                    name="utfortDato"
                    defaultValue={data.meta.utfortDato}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Revisjonsdato</label>
                <input
                  type="date"
                  name="revisjonsDato"
                  defaultValue={data.meta.revisjonsDato}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notater</label>
                <textarea
                  name="notater"
                  defaultValue={data.meta.notater}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMetaModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  <Save className="w-5 h-5 inline mr-2" />
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

export default AirflowSchedule;

