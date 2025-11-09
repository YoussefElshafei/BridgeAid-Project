import React, { useState } from 'react';
import { 
  AlertCircle, 
  Flame, 
  Droplet, 
  Wind, 
  Activity, 
  MapPin, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  DollarSign,
  User,
  Menu,
  X
} from 'lucide-react';

// ==================== NAVBAR ====================
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Login - Left Side */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">BridgeAid</span>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-white">
              <User className="w-4 h-4" />
              <span className="font-medium">Login</span>
            </button>
          </div>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-slate-300 hover:text-white transition-colors font-medium">
              Homepage
            </a>
            <a href="/prepare" className="text-slate-300 hover:text-white transition-colors font-medium">
              Prepare
            </a>
            <a href="/recovery" className="text-orange-400 font-medium">
              Recovery
            </a>
            <a href="/report" className="text-slate-300 hover:text-white transition-colors font-medium">
              Report
            </a>
            <a href="/request-aid" className="text-slate-300 hover:text-white transition-colors font-medium">
              Request Aid
            </a>
            <a href="/volunteer" className="text-slate-300 hover:text-white transition-colors font-medium">
              Volunteer
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <a href="/" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Homepage
            </a>
            <a href="/prepare" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Prepare
            </a>
            <a href="/recovery" className="block text-orange-400 font-medium py-2">
              Recovery
            </a>
            <a href="/report" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Report
            </a>
            <a href="/request-aid" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Request Aid
            </a>
            <a href="/volunteer" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Volunteer
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

// ==================== RECOVERY PAGE ====================
const Recovery = () => {
  const [viewMode, setViewMode] = useState('global');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // Hardcoded incident data
  const incidents = [
    {
      id: 1,
      name: "Northern Forest Fire",
      type: "Wildfire",
      region: "British Columbia, Canada",
      status: "Active",
      distance: 350,
      description: "Large wildfire affecting forested areas with evacuation orders in place.",
      progress: 25,
      affected: 12000,
      aid: 2500000,
      url: "https://www.redcross.ca/how-we-help/current-emergency-responses"
    },
    {
      id: 2,
      name: "Coastal Flooding Event",
      type: "Flood",
      region: "Nova Scotia, Canada",
      status: "Monitoring",
      distance: 1200,
      description: "Heavy rainfall causing coastal flooding in multiple communities.",
      progress: 60,
      affected: 8500,
      aid: 1800000,
      url: "https://www.redcross.ca/how-we-help/current-emergency-responses"
    },
    {
      id: 3,
      name: "Prairie Storm System",
      type: "Storm",
      region: "Saskatchewan, Canada",
      status: "Contained",
      distance: 2100,
      description: "Severe thunderstorms with high winds and hail damage.",
      progress: 80,
      affected: 5000,
      aid: 900000,
      url: "https://www.redcross.ca/how-we-help/current-emergency-responses"
    },
    {
      id: 4,
      name: "West Coast Tremor",
      type: "Earthquake",
      region: "Vancouver, Canada",
      status: "Resolved",
      distance: 3500,
      description: "Minor earthquake with infrastructure assessment complete.",
      progress: 95,
      affected: 2000,
      aid: 500000,
      url: "https://www.redcross.ca/how-we-help/current-emergency-responses"
    }
  ];

  const statusColors = {
    Active: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30',
    Monitoring: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30',
    Contained: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30',
    Resolved: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
  };

  const typeIcons = {
    Wildfire: <Flame className="w-5 h-5" />,
    Flood: <Droplet className="w-5 h-5" />,
    Storm: <Wind className="w-5 h-5" />,
    Earthquake: <Activity className="w-5 h-5" />
  };

  const typeColors = {
    Wildfire: 'bg-gradient-to-br from-orange-500 to-red-600',
    Flood: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    Storm: 'bg-gradient-to-br from-slate-500 to-gray-700',
    Earthquake: 'bg-gradient-to-br from-purple-500 to-violet-600'
  };

  const filters = ['All', 'Wildfire', 'Flood', 'Storm', 'Earthquake'];
  
  const filteredIncidents = activeFilter === 'All' 
    ? incidents 
    : incidents.filter(i => i.type === activeFilter);

  const nearbyIncidents = viewMode === 'nearby' 
    ? filteredIncidents.filter(i => i.distance < 500)
    : filteredIncidents;

  // Global stats
  const totalAid = incidents.reduce((sum, i) => sum + i.aid, 0);
  const totalAffected = incidents.reduce((sum, i) => sum + i.affected, 0);
  const avgProgress = Math.round(incidents.reduce((sum, i) => sum + i.progress, 0) / incidents.length);
  const activeCount = incidents.filter(i => i.status === 'Active').length;

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Disaster Recovery Hub
              </h1>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">McMaster University, Hamilton, ON</span>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh</span>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('global')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                viewMode === 'global'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
              }`}
            >
              Global View
            </button>
            <button
              onClick={() => setViewMode('nearby')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                viewMode === 'nearby'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
              }`}
            >
              Nearby ({incidents.filter(i => i.distance < 500).length})
            </button>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <AlertCircle className="w-8 h-8 text-white/90" />
              <div className="text-sm font-medium text-white/80 uppercase">Active</div>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{activeCount}</div>
            <div className="text-sm text-white/80">Incidents</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-white/90" />
              <div className="text-sm font-medium text-white/80 uppercase">Aid</div>
            </div>
            <div className="text-4xl font-bold text-white mb-1">${(totalAid / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-white/80">Deployed</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-white/90" />
              <div className="text-sm font-medium text-white/80 uppercase">Progress</div>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{avgProgress}%</div>
            <div className="text-sm text-white/80">Avg Recovery</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-white/90" />
              <div className="text-sm font-medium text-white/80 uppercase">Affected</div>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{(totalAffected / 1000).toFixed(1)}K</div>
            <div className="text-sm text-white/80">People</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-5 mb-6">
          <div className="flex gap-3 flex-wrap">
            {filters.map(filter => {
              const count = filter === 'All'
                ? incidents.length
                : incidents.filter(i => i.type === filter).length;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {filter} <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Incident Grid */}
        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-12 h-12 text-white/60 mx-auto mb-4 animate-spin" />
            <p className="text-white/80 text-lg">Loading incidents...</p>
          </div>
        ) : nearbyIncidents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-16 text-center">
            <AlertCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/80 text-lg">No incidents found for this view</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nearbyIncidents.map(incident => (
              <div
                key={incident.id}
                className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`${typeColors[incident.type]} p-3 rounded-xl text-white shadow-lg`}>
                      {typeIcons[incident.type]}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white mb-1">{incident.name}</h3>
                      <p className="text-sm text-white/70">{incident.region}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${statusColors[incident.status]}`}>
                    {incident.status}
                  </span>
                </div>

                {viewMode === 'nearby' && (
                  <div className="flex items-center gap-2 text-sm text-white/80 mb-3 bg-white/5 rounded-lg px-3 py-2 w-fit">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{incident.distance} km away</span>
                  </div>
                )}

                <p className="text-sm text-white/80 mb-5 leading-relaxed">{incident.description}</p>

                <div className="mb-5">
                  <div className="flex justify-between text-sm text-white/80 mb-3">
                    <span className="font-medium">Recovery Progress</span>
                    <span className="font-bold text-white">{incident.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${incident.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={incident.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                  >
                    View Aid Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recovery;