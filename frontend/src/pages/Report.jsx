import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, AlertCircle, MapPin, Send, CheckCircle, XCircle, User, Menu, X } from 'lucide-react';

// Navigation Bar Component
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

  const getUsername = (email) => {
    return email ? email.split('@')[0] : '';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Login - Left Side */}
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
                  <span className="font-medium">{getUsername(userEmail)}</span>
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

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors font-medium">
              Homepage
            </Link>
            <Link to="/prepare" className="text-slate-300 hover:text-white transition-colors font-medium">
              Prepare
            </Link>
            <Link to="/recovery" className="text-slate-300 hover:text-white transition-colors font-medium">
              Recovery
            </Link>
            <Link to="/report" className="text-orange-400 font-medium">
              Report
            </Link>
            <Link to="/request-aid" className="text-slate-300 hover:text-white transition-colors font-medium">
              Request Aid
            </Link>
            <Link to="/volunteer" className="text-slate-300 hover:text-white transition-colors font-medium">
              Volunteer
            </Link>
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
            <Link to="/" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Homepage
            </Link>
            <Link to="/prepare" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Prepare
            </Link>
            <Link to="/recovery" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Recovery
            </Link>
            <Link to="/report" className="block text-orange-400 font-medium py-2">
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

const IncidentReport = () => {
  const [incidentType, setIncidentType] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const incidentTypes = [
    "Power Outage",
    "Flooding",
    "Wildfire",
    "Road Blocked",
    "Bridge Damage",
    "Building Collapse",
    "Medical Emergency",
    "Gas Leak",
    "Landslide",
    "Storm Damage",
    "Water Contamination",
    "Communication Outage"
  ];

  const handleSubmit = async () => {
    setError('');
    setResponse(null);

    if (!incidentType) {
      setError('Please select an incident type');
      return;
    }

    if (!address.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('You must be logged in to report incidents');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/incidents/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: incidentType,
          address: address.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError('You recently reported this incident. Please wait before reporting again.');
        } else {
          setError(data.error || 'Failed to submit report');
        }
        setLoading(false);
        return;
      }

      setResponse(data);
      setIncidentType('');
      setAddress('');
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="flex items-center justify-center p-6 pt-32">
        <div className="w-full max-w-2xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Report an Incident</h1>
            <p className="text-white/70">
              Help your community by reporting emergencies in your area
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {response && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-200 text-sm font-semibold">Report submitted successfully!</p>
                </div>
                <p className="text-green-200/80 text-sm ml-8 mb-2">{response.message}</p>
                {response.address && (
                  <p className="text-green-200/70 text-sm ml-8">
                    <span className="font-semibold">Location:</span> {response.address}
                  </p>
                )}
                {response.lat && response.lng && (
                  <p className="text-green-200/70 text-sm ml-8">
                    <span className="font-semibold">Coordinates:</span> {response.lat}, {response.lng}
                  </p>
                )}
                {response.confirmed && (
                  <div className="mt-3 ml-8 p-3 bg-green-500/20 border border-green-500/40 rounded-lg">
                    <p className="text-green-200 text-sm font-semibold">
                      ✓ Incident confirmed by multiple reports
                    </p>
                    <p className="text-green-200/70 text-xs mt-1">
                      Verified by {response.confirmed_entry?.report_count || 0} users in the area
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Incident Type */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Incident Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <AlertCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none z-10" />
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.25rem'
                    }}
                  >
                    <option value="" className="bg-slate-800">-- Select Incident Type --</option>
                    {incidentTypes.map((type) => (
                      <option key={type} value={type} className="bg-slate-800">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Location / Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., 123 Main St, Milton, ON"
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-white/50 text-xs mt-2">
                  Enter the full address or nearest intersection
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Report
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-blue-200/80 text-sm">
                <span className="font-semibold text-blue-200">Note:</span> Your report will be cross-verified with other reports in the area. 
                Multiple reports help confirm incidents and alert emergency services.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-white/60 text-sm">
                For immediate life-threatening emergencies, call 911
              </p>
            </div>
            <div className="text-center">
              <Link
                to="/"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                ← Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReport;