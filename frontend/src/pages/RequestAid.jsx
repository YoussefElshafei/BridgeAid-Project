import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, User, MapPin, Heart, AlertCircle, CheckCircle, Package, Home, Stethoscope, Utensils, Loader, Menu, X, Phone, Users } from 'lucide-react';

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
            <Link to="/request-aid" className="text-orange-400 font-medium">
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
            <Link to="/report" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
              Report
            </Link>
            <Link to="/request-aid" className="block text-orange-400 font-medium py-2">
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

const RequestAid = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    aid_type: '',
    description: '',
    urgency: 'medium',
    household_size: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const aidTypes = [
    { value: 'food', label: 'Food & Water', icon: Utensils, color: 'from-green-500 to-emerald-600' },
    { value: 'shelter', label: 'Shelter & Housing', icon: Home, color: 'from-blue-500 to-cyan-600' },
    { value: 'medical', label: 'Medical Supplies', icon: Stethoscope, color: 'from-red-500 to-rose-600' },
    { value: 'supplies', label: 'Emergency Supplies', icon: Package, color: 'from-purple-500 to-violet-600' },
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500' },
  ];

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
    if (!formData.name || !formData.contact || !formData.address || !formData.aid_type) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to request aid');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/aid/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Aid request submitted successfully! Our team will contact you soon.');
        setFormData({
          name: '',
          contact: '',
          address: '',
          aid_type: '',
          description: '',
          urgency: 'medium',
          household_size: ''
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit aid request');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="p-6 pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-6 shadow-2xl shadow-purple-500/30">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Request Aid</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
              Need emergency assistance? Fill out this form and our team will connect you with available resources as quickly as possible.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 border border-white/20"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Aid Request Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 mb-8">
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

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Contact Information <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Phone number or email"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, Province"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Aid Type Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Type of Aid Needed <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aidTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.aid_type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, aid_type: type.value })}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white font-medium">{type.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Urgency Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {urgencyLevels.map((level) => {
                    const isSelected = formData.urgency === level.value;
                    return (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, urgency: level.value })}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-4 h-4 ${level.color} rounded-full`}></div>
                          <span className="text-white text-sm font-medium">{level.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Household Size */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Household Size (Optional)
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="number"
                    name="household_size"
                    value={formData.household_size}
                    onChange={handleInputChange}
                    placeholder="Number of people"
                    min="1"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please provide any additional information that will help us assist you better..."
                  rows="4"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    Submit Aid Request
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-blue-500/10 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6">
            <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              What happens next?
            </h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Our team will review your request within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>We'll connect you with available resources in your area</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>You'll receive updates via your provided contact information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>For immediate emergencies, please call 911</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAid;