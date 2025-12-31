import React, { useState } from 'react';
import { FolderPlus, ArrowLeft, Calendar, MapPin, Building, Users, CheckSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function CreateProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    address: '',
    buildingOwner: '',
    contractor: '',
    disciplines: {
      ventilation: false,
      sanitary: false,
      heating: false
    },
    startDate: '',
    completionDate: '',
    buildingTypes: {
      bolig: false,
      kontor: false,
      skole: false,
      barnehage: false,
      sykehus: false,
      hotell: false,
      idrettsbygg: false,
      industri: false,
      lager: false
    },
    area: ''
  });

  const buildingTypesList = [
    { key: 'bolig', label: 'Bolig', color: 'from-blue-500 to-cyan-500' },
    { key: 'kontor', label: 'Kontor', color: 'from-gray-600 to-gray-700' },
    { key: 'skole', label: 'Skole', color: 'from-yellow-500 to-orange-500' },
    { key: 'barnehage', label: 'Barnehage', color: 'from-pink-500 to-rose-500' },
    { key: 'sykehus', label: 'Sykehus', color: 'from-red-500 to-red-600' },
    { key: 'hotell', label: 'Hotell', color: 'from-purple-500 to-indigo-500' },
    { key: 'idrettsbygg', label: 'Idrettsbygg', color: 'from-green-500 to-emerald-500' },
    { key: 'industri', label: 'Industri', color: 'from-orange-600 to-red-600' },
    { key: 'lager', label: 'Lager', color: 'from-slate-500 to-slate-600' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Valider at minst ett fag er valgt
    const hasSelectedDiscipline = Object.values(formData.disciplines).some(val => val);
    if (!hasSelectedDiscipline) {
      alert('Vennligst velg minst ett fag');
      return;
    }

    // Valider at minst én byggtype er valgt
    const hasSelectedBuildingType = Object.values(formData.buildingTypes).some(val => val);
    if (!hasSelectedBuildingType) {
      alert('Vennligst velg minst én byggtype');
      return;
    }

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('eagleflow_current_user'));
    if (!currentUser) {
      alert('Du må være innlogget for å opprette et prosjekt.');
      navigate('/login');
      return;
    }

    // Create project object
    const newProject = {
      id: Date.now(),
      ownerId: currentUser.id,
      ownerEmail: currentUser.email,
      name: formData.projectName,
      address: formData.address,
      buildingOwner: formData.buildingOwner,
      contractor: formData.contractor,
      disciplines: formData.disciplines,
      startDate: formData.startDate,
      completionDate: formData.completionDate,
      buildingTypes: formData.buildingTypes,
      area: formData.area,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Aktiv',
      tasks: [], // Tom array for oppgaver
      members: [] // Tom array for medlemmer
    };

    // Save to localStorage
    const existingProjects = JSON.parse(localStorage.getItem('eagleflow_projects') || '[]');
    existingProjects.push(newProject);
    localStorage.setItem('eagleflow_projects', JSON.stringify(existingProjects));
    
    // Set flag for newly created project to auto-select it
    localStorage.setItem('eagleflow_newly_created_project', newProject.id.toString());

    console.log('Creating project:', newProject);
    
    // Vis suksessmelding
    alert('Prosjekt opprettet! Du blir nå sendt til dashboard.');
    
    // Redirect til dashboard
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDisciplineChange = (discipline) => {
    setFormData({
      ...formData,
      disciplines: {
        ...formData.disciplines,
        [discipline]: !formData.disciplines[discipline]
      }
    });
  };

  const handleBuildingTypeChange = (buildingType) => {
    setFormData({
      ...formData,
      buildingTypes: {
        ...formData.buildingTypes,
        [buildingType]: !formData.buildingTypes[buildingType]
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Tilbake til Dashboard
        </Link>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-teal-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg">
              <FolderPlus className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-teal-800">Opprett Nytt Prosjekt</h1>
              <p className="text-gray-600 mt-1">Fyll inn prosjektinformasjon for å komme i gang</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200">
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-teal-600" />
                Grunnleggende Informasjon
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Project Name */}
                <div className="md:col-span-2">
                  <label htmlFor="projectName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Prosjektnavn *
                  </label>
                  <input
                    id="projectName"
                    name="projectName"
                    type="text"
                    required
                    value={formData.projectName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="F.eks. Byggeprosjekt Oslo Sentrum"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Adresse *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="Gateadresse, postnummer og sted"
                  />
                </div>

                {/* Building Owner */}
                <div>
                  <label htmlFor="buildingOwner" className="block text-sm font-semibold text-gray-700 mb-2">
                    Byggherre *
                  </label>
                  <input
                    id="buildingOwner"
                    name="buildingOwner"
                    type="text"
                    required
                    value={formData.buildingOwner}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="Navn på byggherre"
                  />
                </div>

                {/* Contractor */}
                <div>
                  <label htmlFor="contractor" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Kontraktspartner *
                  </label>
                  <input
                    id="contractor"
                    name="contractor"
                    type="text"
                    required
                    value={formData.contractor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="Navn på kontraktspartner"
                  />
                </div>
              </div>
            </div>

            {/* Disciplines Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-teal-600" />
                Fag Inkludert *
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Ventilation */}
                <button
                  type="button"
                  onClick={() => handleDisciplineChange('ventilation')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    formData.disciplines.ventilation
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">Ventilasjon</span>
                    {formData.disciplines.ventilation && <CheckSquare className="w-6 h-6" />}
                  </div>
                  <p className={`text-sm ${formData.disciplines.ventilation ? 'text-white/90' : 'text-gray-500'}`}>
                    Luftmengder, kanaler og trykkfall
                  </p>
                </button>

                {/* Sanitary */}
                <button
                  type="button"
                  onClick={() => handleDisciplineChange('sanitary')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    formData.disciplines.sanitary
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">Sanitær</span>
                    {formData.disciplines.sanitary && <CheckSquare className="w-6 h-6" />}
                  </div>
                  <p className={`text-sm ${formData.disciplines.sanitary ? 'text-white/90' : 'text-gray-500'}`}>
                    Vann, avløp og sanitærutstyr
                  </p>
                </button>

                {/* Heating */}
                <button
                  type="button"
                  onClick={() => handleDisciplineChange('heating')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    formData.disciplines.heating
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-600 text-white shadow-lg scale-105'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">Varme/Kjøling</span>
                    {formData.disciplines.heating && <CheckSquare className="w-6 h-6" />}
                  </div>
                  <p className={`text-sm ${formData.disciplines.heating ? 'text-white/90' : 'text-gray-500'}`}>
                    Varmebehov og distribusjon
                  </p>
                </button>
              </div>

              {!formData.disciplines.ventilation && !formData.disciplines.sanitary && !formData.disciplines.heating && (
                <p className="text-sm text-red-600 mt-2">* Velg minst ett fag</p>
              )}
            </div>

            {/* Project Details Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-teal-600" />
                Prosjektdetaljer
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Prosjekt Startdato *
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                  />
                </div>

                {/* Completion Date */}
                <div>
                  <label htmlFor="completionDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Overleveringsdato *
                  </label>
                  <input
                    id="completionDate"
                    name="completionDate"
                    type="date"
                    required
                    value={formData.completionDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                  />
                </div>

                {/* Area */}
                <div>
                  <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-2">
                    Areal (m²) *
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="number"
                    required
                    min="1"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="Totalt areal i m²"
                  />
                </div>
              </div>
            </div>

            {/* Building Types Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-teal-600" />
                Byggtype *
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {buildingTypesList.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => handleBuildingTypeChange(type.key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.buildingTypes[type.key]
                        ? `bg-gradient-to-br ${type.color} border-transparent text-white shadow-lg scale-105`
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-teal-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{type.label}</span>
                      {formData.buildingTypes[type.key] && <CheckSquare className="w-5 h-5" />}
                    </div>
                  </button>
                ))}
              </div>

              {!Object.values(formData.buildingTypes).some(val => val) && (
                <p className="text-sm text-red-600 mt-2">* Velg minst én byggtype</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Link
                to="/dashboard"
                className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-all duration-200 text-center"
              >
                Avbryt
              </Link>
              <button
                type="submit"
                className="flex-1 px-6 py-4 bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-800 hover:to-cyan-800 text-white font-bold rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                Opprett Prosjekt
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;

