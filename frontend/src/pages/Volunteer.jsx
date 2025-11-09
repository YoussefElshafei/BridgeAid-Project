import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, User, MapPin, Heart, AlertCircle, CheckCircle, Users, Loader, Menu, X } from 'lucide-react';

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
            <Link to="/report" className="text-slate-300 hover:text-white transition-colors font-medium">
              Report
            </Link>
            <Link to="/request-aid" className="text-slate-300 hover:text-white transition-colors font-medium">
              Request Aid
            </Link>
            <Link to="/volunteer" className="text-orange-400 font-medium">
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
            <Link to="/report" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Report
            </Link>
            <Link to="/request-aid" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Request Aid
            </Link>
            <Link to="/volunteer" className="block text-orange-400 font-medium py-2">
              Volunteer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const Volunteers = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [formData, setFormData] = useState({
    legal_name: '',
    location: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const categories = [
    "Food Bank Volunteer",
    "Disaster Relief Volunteer",
    "Shelter Volunteer"
  ];

  // Fetch volunteers on mount
  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoadingList(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to view volunteers');
        setLoadingList(false);
        return;
      }

      const response = await fetch('http://localhost:5000/volunteer', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVolunteers(data.volunteers || []);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to load volunteers');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Error:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.legal_name || !formData.location || !formData.category) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to register as a volunteer');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/volunteer/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Successfully registered as a volunteer!');
        setFormData({ legal_name: '', location: '', category: '' });
        
        // Refresh volunteer list
        setTimeout(() => {
          fetchVolunteers();
          setShowRegister(false);
          setSuccess('');
        }, 2000);
      } else if (response.status === 409) {
        const data = await response.json();
        setError('You are already registered as a volunteer');
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Food Bank Volunteer":
        return "from-green-500 to-emerald-600";
      case "Disaster Relief Volunteer":
        return "from-red-500 to-orange-600";
      case "Shelter Volunteer":
        return "from-blue-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Food Bank Volunteer":
        return "🍎";
      case "Disaster Relief Volunteer":
        return "🚨";
      case "Shelter Volunteer":
        return "🏠";
      default:
        return "❤️";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="p-6 pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">BridgeAid Volunteers</h1>
            <p className="text-white/70 mb-6">Join our community of dedicated volunteers</p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowRegister(!showRegister)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:scale-105"
              >
                {showRegister ? 'View Volunteers' : 'Register as Volunteer'}
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 border border-white/20"
              >
                ← Back to Home
              </Link>
            </div>
          </div>

          {/* Registration Form */}
          {showRegister && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Register as a Volunteer</h2>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-200 text-sm">{success}</p>
                </div>
              )}

              <div className="space-y-5">
                {/* Legal Name */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      name="legal_name"
                      value={formData.legal_name}
                      onChange={handleInputChange}
                      placeholder="First Last"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Street, City, Province"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-800">Select a category...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-800">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Registering...' : 'Register as Volunteer'}
                </button>
              </div>
            </div>
          )}

          {/* Volunteers List */}
          {!showRegister && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Active Volunteers</h2>
              </div>

              {loadingList ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 text-white animate-spin" />
                </div>
              ) : volunteers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/60 text-lg">No volunteers registered yet. Be the first!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {volunteers.map((volunteer, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(volunteer.category)} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                          {getCategoryIcon(volunteer.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-lg truncate">
                            {volunteer.legal_name}
                          </h3>
                          <p className="text-white/60 text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {volunteer.location}
                          </p>
                        </div>
                      </div>
                      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${getCategoryColor(volunteer.category)} rounded-lg text-white text-xs font-semibold`}>
                        {volunteer.category}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Volunteers;