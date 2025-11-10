import React, { useState, useEffect, useRef } from 'react';
import { Flame, Shield, Heart, AlertTriangle, Users, MapPin, ArrowRight, TrendingUp, Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">BridgeAid</span>
            </Link>
            
            {userEmail ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-white">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{userEmail}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-white">
                <User className="w-4 h-4" />
                <span className="font-medium">Login</span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white font-medium">
              Homepage
            </Link>
            <Link to="/prepare" className="text-slate-300 hover:text-white transition-colors font-medium">
              Prepare
            </Link>
            <Link to="/recovery" className="text-slate-300 hover:text-white transition-colors font-medium">
              Recovery
            </Link>
            <Link to="/report" className="text-slate-300 hover:text-white transition-colors font-medium">
              Report
            </Link>
            <Link to="/request-aid" className="text-slate-300 hover:text-white transition-colors font-medium">
              Request Aid
            </Link>
            <Link to="/volunteer" className="text-slate-300 hover:text-white transition-colors font-medium">
              Volunteer
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link to="/" className="block text-white font-medium py-2">
              Homepage
            </Link>
            <Link to="/prepare" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Prepare
            </Link>
            <Link to="/recovery" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Recovery
            </Link>
            <Link to="/report" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Report
            </Link>
            <Link to="/request-aid" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Request Aid
            </Link>
            <Link to="/volunteer" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Volunteer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

// Live Map Component
const LiveMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [status, setStatus] = useState('Loading map...');

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    
    script.onload = () => {
      initMap();
    };
    
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  const initMap = () => {
    if (!window.L || !mapRef.current) return;

    // Initialize map centered on Hamilton, Ontario
    const map = window.L.map(mapRef.current).setView([43.2557, -79.8711], 11);
    mapInstanceRef.current = map;

    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    setStatus('Map loaded. Fetching incidents...');

    // Fetch incidents from backend
    fetchIncidents(map);
  };

  const fetchIncidents = async (map) => {
    try {
      const response = await fetch('http://localhost:5000/api/incidents');
      
      if (response.ok) {
        const data = await response.json();
        const incidents = data.confirmed || [];
        
        if (incidents.length === 0) {
          setStatus('No confirmed incidents at this time.');
        } else {
          setStatus(`Showing ${incidents.length} confirmed incident(s)`);
          
          // Add markers for each incident
          incidents.forEach(incident => {
            const marker = window.L.marker([incident.lat, incident.lng]).addTo(map);
            marker.bindPopup(`
              <div style="color: #1e293b;">
                <strong style="font-size: 14px;">${incident.incident}</strong><br/>
                <span style="font-size: 12px; color: #64748b;">Reports: ${incident.report_count}</span><br/>
                <span style="font-size: 11px; color: #94a3b8;">${new Date(incident.timestamp).toLocaleString()}</span>
              </div>
            `);
          });
        }
      } else {
        setStatus('Unable to load incidents.');
      }
    } catch (err) {
      console.error('Error fetching incidents:', err);
      setStatus('Error loading incidents.');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-8 h-8 text-white" />
        <h2 className="text-3xl font-bold text-white">Live Disaster Map</h2>
      </div>
      <p className="text-white/70 mb-4 text-lg">
        Track active disasters and recovery efforts in real-time across your region
      </p>
      <p className="text-white/60 text-sm mb-6">{status}</p>
      
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-[500px] rounded-2xl border-2 border-white/20 bg-slate-800"
        style={{ zIndex: 1 }}
      />
      
      <p className="text-white/50 text-sm mt-4">
        Pins show confirmed incidents (3+ unique reports)
      </p>
    </div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
                <Flame className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              BridgeAid
            </h1>
            <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connecting communities in times of crisis. Prepare, respond, and recover together.
            </p>

            {/* Prominent Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link
                to="/report"
                className="group px-10 py-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105 flex items-center justify-center gap-3"
              >
                <AlertTriangle className="w-7 h-7" />
                Report Emergency
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/request-aid"
                className="group px-10 py-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105 flex items-center justify-center gap-3"
              >
                <Heart className="w-7 h-7" />
                Request Aid
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-white/60">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Over 10,000 people helped this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Disaster Map Section */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <LiveMap />
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">How We Help Communities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Prepare */}
            <Link to="/prepare" className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Prepare</h3>
              <p className="text-white/70 leading-relaxed">
                Get ready before disaster strikes. Access emergency kits, safety plans, and educational resources to protect your family and community.
              </p>
            </Link>

            {/* Recovery */}
            <Link to="/recovery" className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Recovery</h3>
              <p className="text-white/70 leading-relaxed">
                Track ongoing disaster recovery efforts, find relief resources, and support affected communities through donations and aid.
              </p>
            </Link>

            {/* Report */}
            <Link to="/report" className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-red-500 to-rose-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Report</h3>
              <p className="text-white/70 leading-relaxed">
                Quickly report emergencies and disasters in your area. Help first responders get accurate, real-time information to save lives.
              </p>
            </Link>

            {/* Request Aid */}
            <Link to="/request-aid" className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Request Aid</h3>
              <p className="text-white/70 leading-relaxed">
                Need help? Submit aid requests for food, shelter, medical supplies, or other emergency assistance. We connect you with resources fast.
              </p>
            </Link>

            {/* Volunteer */}
            <Link to="/volunteer" className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Volunteer</h3>
              <p className="text-white/70 leading-relaxed">
                Make a difference in your community. Sign up to volunteer during emergencies, offer skills, or join local response teams.
              </p>
            </Link>

            {/* Community Impact */}
            <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-2xl shadow-xl border border-pink-500/30 p-8">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">People Helped</span>
                  <span className="text-2xl font-bold text-white">27.5K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Active Volunteers</span>
                  <span className="text-2xl font-bold text-white">3,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Aid Distributed</span>
                  <span className="text-2xl font-bold text-white">$8.2M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl shadow-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of community members working together to build safer, more resilient neighborhoods.
            </p>
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-300 shadow-xl hover:scale-105"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;