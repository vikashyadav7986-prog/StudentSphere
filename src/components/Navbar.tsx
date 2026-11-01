import React, { useState } from 'react';
import { ViewType, User } from '../types';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenUpload: () => void;
  onOpenReport: () => void;
  totalRecordsCount?: number;
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  onOpenReport,
  totalRecordsCount = 0,
  currentUser,
  onOpenLogin,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onNavigate('home')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Student<span className="text-emerald-500">Sphere</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-mono border border-emerald-800/60 hidden sm:inline-block">
                  Campus Hub
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden md:block">
                University Academic &amp; Resource Platform
              </p>
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/30 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
                currentView === 'home'
                  ? 'text-white bg-white/10 shadow-sm shadow-emerald-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className="fa-solid fa-house text-emerald-400"></i>
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('repository')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
                currentView === 'repository'
                  ? 'text-white bg-white/10 shadow-sm shadow-emerald-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className="fa-solid fa-book-bookmark text-emerald-500"></i>
              <span>Academic Repository</span>
            </button>

            <button
              onClick={() => onNavigate('lostfound')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
                currentView === 'lostfound'
                  ? 'text-white bg-white/10 shadow-sm shadow-amber-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className="fa-solid fa-magnifying-glass-location text-amber-400"></i>
              <span>Lost &amp; Found</span>
            </button>

            <button
              onClick={() => onNavigate('announcements')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
                currentView === 'announcements'
                  ? 'text-white bg-white/10 shadow-sm shadow-teal-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className="fa-solid fa-bullhorn text-teal-400"></i>
              <span>Announcements</span>
            </button>

            {/* Database Studio Tab */}
            <button
              onClick={() => onNavigate('database')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
                currentView === 'database'
                  ? 'text-white bg-emerald-600/30 border border-emerald-500/40 text-emerald-300'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
              }`}
            >
              <i className="fa-solid fa-database"></i>
              <span>Database Studio</span>
              {totalRecordsCount > 0 && (
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-700/60 font-mono">
                  {totalRecordsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons & Authentication */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenUpload}
              className="hidden xl:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <span>Upload Notes</span>
            </button>

            <button
              onClick={onOpenReport}
              className="hidden sm:flex items-center gap-2 bg-amber-600/90 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-lg shadow-amber-600/20 active:scale-95 border border-amber-500/30 cursor-pointer"
            >
              <i className="fa-solid fa-plus-circle"></i>
              <span>Report Item</span>
            </button>

            {/* Login / User Profile Component */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer group"
                title="View user profile"
              >
                <UserAvatar user={currentUser} size="sm" />
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate max-w-[90px]">
                      {currentUser.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-950 text-purple-300'
                          : currentUser.role === 'faculty'
                          ? 'bg-teal-950 text-teal-300'
                          : 'bg-emerald-950 text-emerald-300'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-down text-[10px] text-gray-500 group-hover:text-gray-300 hidden sm:inline-block"></i>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition border border-emerald-500/40 shadow-sm cursor-pointer active:scale-95"
              >
                <i className="fa-solid fa-right-to-bracket text-emerald-400"></i>
                <span>Login</span>
              </button>
            )}

            {/* Mobile Navigation Toggle */}
            <button
              className="lg:hidden p-2 rounded-xl bg-white/5 text-gray-300 hover:text-white border border-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-900/40 bg-[#071f18]/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2">
          {/* User state in mobile */}
          {currentUser ? (
            <div
              onClick={() => {
                onOpenProfile();
                setMobileMenuOpen(false);
              }}
              className="p-3 mb-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <UserAvatar user={currentUser} size="md" />
                <div>
                  <span className="text-xs font-bold text-white block">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono capitalize">
                    {currentUser.role} &bull; {currentUser.department}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-400">Profile &gt;</span>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full mb-2 text-center bg-emerald-600/30 border border-emerald-500/40 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>Sign In / Register</span>
            </button>
          )}

          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-gray-200 hover:bg-emerald-900/50 flex items-center gap-2"
          >
            <i className="fa-solid fa-house w-6 text-emerald-400"></i>
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              onNavigate('repository');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-gray-200 hover:bg-emerald-900/50 flex items-center gap-2"
          >
            <i className="fa-solid fa-book-bookmark w-6 text-emerald-500"></i>
            <span>Academic Repository</span>
          </button>
          <button
            onClick={() => {
              onNavigate('lostfound');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-gray-200 hover:bg-emerald-900/50 flex items-center gap-2"
          >
            <i className="fa-solid fa-magnifying-glass-location w-6 text-amber-400"></i>
            <span>Lost &amp; Found Engine</span>
          </button>
          <button
            onClick={() => {
              onNavigate('announcements');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-gray-200 hover:bg-emerald-900/50 flex items-center gap-2"
          >
            <i className="fa-solid fa-bullhorn w-6 text-teal-400"></i>
            <span>Announcements</span>
          </button>
          <button
            onClick={() => {
              onNavigate('database');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-emerald-400 hover:bg-emerald-900/50 flex items-center gap-2"
          >
            <i className="fa-solid fa-database w-6 text-emerald-400"></i>
            <span>Database Studio ({totalRecordsCount} records)</span>
          </button>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenUpload();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center bg-emerald-600 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md shadow-emerald-600/20"
            >
              <i className="fa-solid fa-cloud-arrow-up mr-2"></i>Upload Notes
            </button>
            <button
              onClick={() => {
                onOpenReport();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center bg-amber-600 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md shadow-amber-600/20"
            >
              <i className="fa-solid fa-plus-circle mr-2"></i>Report Item
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
