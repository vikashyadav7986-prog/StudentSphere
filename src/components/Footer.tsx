import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/90 py-10 border-t border-emerald-900/30 text-xs text-gray-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md">
              <i className="fa-solid fa-graduation-cap text-base"></i>
            </div>
            <div>
              <span className="text-sm font-bold text-white">StudentSphere Platform</span>
              <p className="text-[11px] text-gray-400">Unified University Academic &amp; Resource Ecosystem</p>
            </div>
          </div>
          <p className="text-center md:text-right text-emerald-400/80 italic font-medium">
            "Making campus life feel a little more connected, together." &bull; Campus Platform &copy; 2026
          </p>
        </div>
      </div>
    </footer>
  );
};
