import React, { useState } from 'react';
import { Flame, Menu, X, User } from 'lucide-react';

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
            
            <a href="/login" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-white">
              <User className="w-4 h-4" />
              <span className="font-medium">Login</span>
            </a>
          </div>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-slate-300 hover:text-white transition-colors font-medium">
              Homepage
            </a>
            <a href="/prepare" className="text-slate-300 hover:text-white transition-colors font-medium">
              Prepare
            </a>
            <a href="/recovery" className="text-slate-300 hover:text-white transition-colors font-medium">
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
            <a href="/recovery" className="block text-slate-300 hover:text-white transition-colors font-medium py-2">
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

export default Navbar;