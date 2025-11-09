import React from 'react';
import { Flame, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BridgeAid</span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for safer communities</span>
          </div>
          
          <div className="text-slate-400 text-sm">
            © 2024 BridgeAid. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;