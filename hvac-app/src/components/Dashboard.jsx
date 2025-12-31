import React, { useState, useEffect } from 'react';
import { BarChart3, Droplets, Thermometer, Wind, CheckSquare, Settings, Plus, ChevronDown, LogOut, User, FolderOpen, Calendar, Menu, ChevronLeft, MapPin, Building, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [userData, setUserData] = useState(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Load current logged in user
  useEffect(() => {
    const loadUserData = () => {
      const currentUser = localStorage.getItem('eagleflow_current_user');
      if (currentUser) {
        setUserData(JSON.parse(currentUser));
      } else {
        // If no user is logged in, redirect to login
        navigate('/login');
      }
    };
    loadUserData();
  }, [navigate]);

  // Close status menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStatusMenu && !event.target.closest('.status-dropdown-container')) {
        setShowStatusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusMenu]);

  // Load projects from localStorage (filtered by current user)
  useEffect(() => {
    const loadProjects = () => {
      if (!userData) return;
      
      const savedProjects = localStorage.getItem('eagleflow_projects');
      if (savedProjects) {
        const allProjects = JSON.parse(savedProjects);
        
        // Filter projects: owned by user OR user is a member
        const userProjects = allProjects.filter(project => {
          // User owns the project
          if (project.ownerId === userData.id) return true;
          
          // User is a member of the project
          if (project.members && project.members.some(m => m.email === userData.email && m.status === 'accepted')) {
            return true;
          }
          
          return false;
        });
        
        setProjects(userProjects);
        
        // Check if there's a newly created project to auto-select
        const newlyCreatedProjectId = localStorage.getItem('eagleflow_newly_created_project');
        if (newlyCreatedProjectId) {
          const newProject = userProjects.find(p => p.id.toString() === newlyCreatedProjectId);
          if (newProject) {
            setSelectedProject(newProject);
            localStorage.removeItem('eagleflow_newly_created_project'); // Clear the flag
          }
        }
        // DO NOT auto-select first project on login
      }
    };

    loadProjects();
    
    // Listen for storage changes (when new project is created)
    window.addEventListener('storage', loadProjects);
    
    return () => {
      window.removeEventListener('storage', loadProjects);
    };
  }, [userData]);

  const handleAddMember = (e) => {
    e.preventDefault();
    
    if (!newMemberEmail.trim()) {
      alert('Vennligst skriv inn en e-postadresse');
      return;
    }

    if (!selectedProject) {
      alert('Vennligst velg et prosjekt først');
      return;
    }

    // Create new member invitation
    const newMember = {
      id: Date.now(),
      email: newMemberEmail,
      status: 'invited',
      invitedDate: new Date().toISOString(),
    };

    // Update project with new member
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          members: [...(project.members || []), newMember]
        };
      }
      return project;
    });

    // Save to localStorage
    localStorage.setItem('eagleflow_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    
    // Update selected project
    const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
    setSelectedProject(updatedSelectedProject);
    
    alert(`Invitasjon sendt til ${newMemberEmail}`);
    
    // Reset og lukk modal
    setNewMemberEmail('');
    setShowAddMemberModal(false);
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedProject) return;

    // Get all projects from localStorage
    const allProjects = JSON.parse(localStorage.getItem('eagleflow_projects') || '[]');
    
    // Update the status
    const updatedProjects = allProjects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          status: newStatus
        };
      }
      return project;
    });

    // Save back to localStorage
    localStorage.setItem('eagleflow_projects', JSON.stringify(updatedProjects));
    
    // Update local state
    const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
    setSelectedProject(updatedSelectedProject);
    
    // Filter for current user's projects
    if (userData) {
      const userProjects = updatedProjects.filter(project => {
        if (project.ownerId === userData.id) return true;
        if (project.members && project.members.some(m => m.email === userData.email && m.status === 'accepted')) {
          return true;
        }
        return false;
      });
      setProjects(userProjects);
    }
    
    setShowStatusMenu(false);
  };

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', active: true, path: '/dashboard' },
    { icon: Droplets, label: 'Sanitær', active: false, path: '/sanitary' },
    { icon: Thermometer, label: 'Varme/Kjøling', active: false, path: '#' },
    { icon: Wind, label: 'Ventilasjon', active: false, path: '#' },
    { icon: CheckSquare, label: 'Oppgaver', active: false, path: '#' },
    { icon: Settings, label: 'Innstillinger', active: false, path: '#' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 flex">
      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
            {/* Close button */}
            <button
              onClick={() => {
                setShowAddMemberModal(false);
                setNewMemberEmail('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">Legg til medlem</h2>
              <p className="text-gray-600 text-center mt-2">Send invitasjon via e-post</p>
            </div>

            {/* Form */}
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label htmlFor="memberEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                  E-postadresse *
                </label>
                <input
                  id="memberEmail"
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                  placeholder="medlem@example.com"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setNewMemberEmail('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  Send invitasjon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-teal-800 to-teal-900 text-white shadow-2xl flex flex-col transition-all duration-300 relative`}>
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-4 top-6 w-8 h-8 bg-teal-700 hover:bg-teal-600 rounded-full flex items-center justify-center shadow-lg z-20 transition-all duration-200"
        >
          {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Logo/User Section */}
        <div className={`p-6 border-b border-teal-700 ${sidebarCollapsed ? 'items-center' : ''}`}>
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  {userData?.profileImage ? (
                    <img src={userData.profileImage} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {userData ? `${userData.firstName} ${userData.lastName}` : 'Bruker'}
                  </h3>
                  <p className="text-teal-300 text-sm">{userData?.position || 'VVS Ingeniør'}</p>
                </div>
                <Link
                  to="/profile-settings"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                  title="Innstillinger"
                >
                  <Wrench className="w-5 h-5 text-teal-300 group-hover:text-white transition-colors" />
                </Link>
              </div>

              {/* EagleFlow Logo */}
              <div className="flex items-center gap-2 justify-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <svg 
                  className="w-8 h-8 text-cyan-400" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M12 2C10 2 8 3 7 5L5 8C4 9 3 11 3 13C3 15 4 16 5 17L7 19C8 20 10 21 12 21C14 21 16 20 17 19L19 17C20 16 21 15 21 13C21 11 20 9 19 8L17 5C16 3 14 2 12 2Z" />
                  <path d="M12 2L15 8M12 2L9 8" />
                </svg>
                <span className="font-bold text-xl">EagleFlow</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <svg 
                className="w-8 h-8 text-cyan-400" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M12 2C10 2 8 3 7 5L5 8C4 9 3 11 3 13C3 15 4 16 5 17L7 19C8 20 10 21 12 21C14 21 16 20 17 19L19 17C20 16 21 15 21 13C21 11 20 9 19 8L17 5C16 3 14 2 12 2Z" />
                <path d="M12 2L15 8M12 2L9 8" />
              </svg>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-teal-200 hover:bg-white/10 hover:text-white'
                  } group relative`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <Icon className="w-6 h-6" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <span className="absolute left-full ml-2 px-3 py-2 bg-teal-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-teal-700">
          <button
            onClick={() => {
              localStorage.removeItem('eagleflow_current_user');
              navigate('/login');
            }}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-center gap-2'} px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-lg group relative`}
            title={sidebarCollapsed ? 'Logg ut' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-medium">Logg ut</span>}
            
            {/* Tooltip for collapsed state */}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 px-3 py-2 bg-red-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Logg ut
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-teal-800">Prosjekt Dashboard</h1>
                <p className="text-gray-600 mt-1">Administrer dine VVS-prosjekter</p>
              </div>

              {/* Project Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-700 to-cyan-700 text-white rounded-lg hover:from-teal-800 hover:to-cyan-800 transition-all shadow-lg"
                >
                  <FolderOpen className="w-5 h-5" />
                  <span className="font-medium">
                    {selectedProject ? selectedProject.name : 'Velg Prosjekt'}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showProjectMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Project Dropdown */}
                {showProjectMenu && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Dine Prosjekter</p>
                    </div>
                    {projects.length > 0 ? (
                      <>
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => {
                              setSelectedProject(project);
                              setShowProjectMenu(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors ${
                              selectedProject?.id === project.id ? 'bg-teal-100' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{project.name}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  {project.createdDate}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  project.status === 'Aktiv'
                                    ? 'bg-green-100 text-green-700'
                                    : project.status === 'Under arbeid'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {project.status}
                              </span>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Ingen prosjekter ennå</p>
                        <p className="text-sm text-gray-400 mt-1">Opprett ditt første prosjekt</p>
                      </div>
                    )}
                    <div className="border-t border-gray-200 mt-2 pt-2 px-4 pb-2">
                      <Link
                        to="/create-project"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">Nytt Prosjekt</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {selectedProject ? (
            <>
              {/* Project Info Card */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedProject.name}</h2>
                    <p className="text-teal-100">Opprettet: {selectedProject.createdDate}</p>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="relative status-dropdown-container">
                    <button
                      onClick={() => setShowStatusMenu(!showStatusMenu)}
                      className={`px-6 py-3 rounded-lg backdrop-blur-sm transition-all cursor-pointer group ${
                        selectedProject.status === 'Aktiv' 
                          ? 'bg-blue-500/90 hover:bg-blue-600' 
                          : selectedProject.status === 'Inaktiv'
                          ? 'bg-orange-500/90 hover:bg-orange-600'
                          : 'bg-green-500/90 hover:bg-green-600'
                      }`}
                    >
                      <p className="text-sm">Status</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{selectedProject.status}</p>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showStatusMenu ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showStatusMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-20">
                        <button
                          onClick={() => handleStatusChange('Aktiv')}
                          className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                            selectedProject.status === 'Aktiv' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              selectedProject.status === 'Aktiv' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                            <span>Aktiv</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange('Inaktiv')}
                          className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${
                            selectedProject.status === 'Inaktiv' ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              selectedProject.status === 'Inaktiv' ? 'bg-orange-500' : 'bg-gray-300'
                            }`}></div>
                            <span>Inaktiv</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange('Ferdig')}
                          className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors ${
                            selectedProject.status === 'Ferdig' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              selectedProject.status === 'Ferdig' ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            <span>Ferdig</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <FolderOpen className="w-6 h-6 text-teal-600" />
                  Prosjektinformasjon
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium text-gray-800">{selectedProject.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Byggherre</p>
                        <p className="font-medium text-gray-800">{selectedProject.buildingOwner}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Kontraktspartner</p>
                        <p className="font-medium text-gray-800">{selectedProject.contractor}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Startdato</p>
                        <p className="font-medium text-gray-800">{selectedProject.startDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Overleveringsdato</p>
                        <p className="font-medium text-gray-800">{selectedProject.completionDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Areal</p>
                        <p className="font-medium text-gray-800">{selectedProject.area} m²</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Building Types */}
                {selectedProject.buildingTypes && Object.values(selectedProject.buildingTypes).some(val => val) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Byggtyper</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedProject.buildingTypes)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => (
                          <span
                            key={key}
                            className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Disciplines */}
                {selectedProject.disciplines && Object.values(selectedProject.disciplines).some(val => val) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Fag</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.disciplines.ventilation && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          Ventilasjon
                        </span>
                      )}
                      {selectedProject.disciplines.sanitary && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          Sanitær
                        </span>
                      )}
                      {selectedProject.disciplines.heating && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          Varme/Kjøling
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tasks and Members Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Arbeidsoppgaver */}
                <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <CheckSquare className="w-6 h-6 text-teal-600" />
                    Arbeidsoppgaver
                  </h3>
                  <div className="space-y-3">
                    {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                      selectedProject.tasks.map((task, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{task.title}</p>
                              <p className="text-sm text-gray-500 mt-1">{task.assignedTo}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              task.status === 'Fullført' 
                                ? 'bg-green-100 text-green-700'
                                : task.status === 'Pågår'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                          {task.dueDate && (
                            <p className="text-xs text-gray-400 mt-2">
                              Frist: {task.dueDate}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Ingen oppgaver ennå</p>
                        <p className="text-sm text-gray-400 mt-1">Opprett din første oppgave</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prosjektmedlemmer */}
                <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <User className="w-6 h-6 text-teal-600" />
                      Prosjektmedlemmer
                    </h3>
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition-colors"
                    >
                      + Legg til
                    </button>
                  </div>
                  
                  {/* Search bar */}
                  {selectedProject.members && selectedProject.members.length > 0 && (
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Søk etter navn eller e-post..."
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {selectedProject.members && selectedProject.members.length > 0 ? (
                      selectedProject.members
                        .filter(member => {
                          if (!memberSearchQuery) return true;
                          const query = memberSearchQuery.toLowerCase();
                          const email = member.email?.toLowerCase() || '';
                          const firstName = member.firstName?.toLowerCase() || '';
                          const lastName = member.lastName?.toLowerCase() || '';
                          const fullName = `${firstName} ${lastName}`;
                          
                          return email.includes(query) || fullName.includes(query);
                        })
                        .map((member, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {member.status === 'invited' ? (
                              <User className="w-6 h-6" />
                            ) : (
                              <>{member.firstName.charAt(0)}{member.lastName.charAt(0)}</>
                            )}
                          </div>
                          <div className="flex-1">
                            {member.status === 'invited' ? (
                              <>
                                <p className="font-semibold text-gray-800">{member.email}</p>
                                <p className="text-sm text-gray-400 italic">Invitert</p>
                              </>
                            ) : (
                              <>
                                <p className="font-semibold text-gray-800">
                                  {member.firstName} {member.lastName}
                                </p>
                                <p className="text-sm text-gray-500">{member.role}</p>
                              </>
                            )}
                          </div>
                          {member.status === 'invited' && (
                            <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              Venter
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Ingen medlemmer ennå</p>
                        <p className="text-sm text-gray-400 mt-1">Legg til prosjektmedlemmer</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No Project Selected */
            <div className="flex flex-col items-center justify-center h-96">
              <div className="text-center">
                <FolderOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Ingen Prosjekt Valgt</h2>
                <p className="text-gray-500 mb-6">Velg et prosjekt fra menyen ovenfor for å komme i gang</p>
                <button
                  onClick={() => setShowProjectMenu(true)}
                  className="px-6 py-3 bg-gradient-to-r from-teal-700 to-cyan-700 text-white rounded-lg hover:from-teal-800 hover:to-cyan-800 transition-all shadow-lg"
                >
                  Velg Prosjekt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

