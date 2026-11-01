import React from 'react';
import { ViewType, PlatformStats } from '../types';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  stats?: PlatformStats;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, stats }) => {
  return (
    <div className="view-section">
      {/* Hero Section with Background Imagery */}
      <section className="relative pt-12 pb-20 gradient-hero overflow-hidden border-b border-emerald-900/30">
        {/* University Campus Background Image with Subtle Blend Overlay */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
            alt="Students collaborating on campus"
            className="w-full h-full object-cover opacity-15 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071f18]/80 via-[#071f18]/90 to-[#081713]"></div>
        </div>

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Platform Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs sm:text-sm font-medium text-emerald-300 border border-emerald-500/30 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-semibold">Unified Campus Platform</span>
              <span className="text-emerald-600">|</span>
              <span className="text-gray-300">Academic & Resource Hub</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Student<span className="gradient-text">Sphere</span>
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100/90 font-light leading-relaxed">
              "Making campus life feel a little more connected, together."
            </p>

            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              The centralized digital ecosystem eliminating fragmented chat groups, buried Google Drive links, and ineffective physical posters with a verified academic archive and high-efficiency campus engine.
            </p>

            {/* Quick Action Feature Access Cards with Visual Image Headers */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
              <div
                onClick={() => onNavigate('repository')}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:border-emerald-500/50 flex flex-col justify-between"
              >
                <div className="h-32 w-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"
                    alt="Academic Repository"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071f18] via-[#071f18]/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-emerald-500/80 text-white flex items-center justify-center text-base shadow-md backdrop-blur-sm">
                    <i className="fa-solid fa-book-bookmark"></i>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                      Academic Repository
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Access lecture notes, past papers & lab manuals by course code.
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <span>Browse Archive</span> <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('lostfound')}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:border-amber-500/50 flex flex-col justify-between"
              >
                <div className="h-32 w-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
                    alt="Lost and Found Engine"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071f18] via-[#071f18]/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-amber-500/80 text-white flex items-center justify-center text-base shadow-md backdrop-blur-sm">
                    <i className="fa-solid fa-magnifying-glass-location"></i>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                      Lost & Found Engine
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Report lost belongings with visual proof and real-time status.
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-amber-400 font-semibold flex items-center gap-1">
                    <span>Search Items</span> <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('announcements')}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:border-teal-500/50 flex flex-col justify-between"
              >
                <div className="h-32 w-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                    alt="Campus Hub Announcements"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071f18] via-[#071f18]/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-teal-500/80 text-white flex items-center justify-center text-base shadow-md backdrop-blur-sm">
                    <i className="fa-solid fa-bullhorn"></i>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
                      Campus Hub
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Verified department notices, exam schedules & peer updates.
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-teal-400 font-semibold flex items-center gap-1">
                    <span>View Notices</span> <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backend & Database Interactive Banner */}
      <section className="py-6 bg-emerald-950/30 border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-500/30 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-xl shrink-0 border border-emerald-500/40">
                <i className="fa-solid fa-server"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Full-Stack Backend & Database Active</span>
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-mono border border-emerald-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    REST API Ready
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Persistent storage enabled. Explore records, inspect API schemas, or manage data in the Database Studio.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {stats && (
                <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-gray-400 pr-4 border-r border-white/10">
                  <div>
                    <span className="text-emerald-400 font-bold">{stats.totalNotes}</span> notes
                  </div>
                  <div>
                    <span className="text-amber-400 font-bold">{stats.totalItems}</span> items
                  </div>
                  <div>
                    <span className="text-teal-400 font-bold">{stats.resolutionRate}%</span> recovery
                  </div>
                </div>
              )}
              <button
                onClick={() => onNavigate('database')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <i className="fa-solid fa-table-columns"></i>
                <span>Open Database Studio</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement / Fragmented Campus Experience Section with Image Cards */}
      <section className="py-16 bg-black/40 border-b border-emerald-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-500 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              Current Campus Challenges
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
              Fragmented Campus Experience
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              How StudentSphere replaces chaotic legacy workflows with structured digital engine protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Scattered Study Resources */}
            <div className="glass-card rounded-2xl overflow-hidden relative group border border-white/5 flex flex-col justify-between">
              <div className="h-40 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
                  alt="Scattered Study Resources"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a21] via-[#0d2a21]/50 to-transparent"></div>
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center text-lg backdrop-blur-sm">
                  <i className="fa-solid fa-folder-tree"></i>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Scattered Study Resources</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Course materials buried in unorganized Drive links, expired chat attachments, and fragmented student groups.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-red-400 font-medium">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>No centralized course archive</span>
                </div>
              </div>
            </div>

            {/* Card 2: Inefficient Lost & Found */}
            <div className="glass-card rounded-2xl overflow-hidden relative group border border-white/5 flex flex-col justify-between">
              <div className="h-40 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80"
                  alt="Inefficient Lost and Found"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a21] via-[#0d2a21]/50 to-transparent"></div>
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-lg backdrop-blur-sm">
                  <i className="fa-solid fa-paperclip"></i>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Inefficient Lost & Found</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Reliance on physical paper flyers taped across campus buildings with less than 15% item recovery success rate.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-amber-400 font-medium">
                  <i className="fa-solid fa-clock"></i>
                  <span>High resolution delay (&gt;3 weeks)</span>
                </div>
              </div>
            </div>

            {/* Card 3: Campus Information Silos */}
            <div className="glass-card rounded-2xl overflow-hidden relative group border border-white/5 flex flex-col justify-between">
              <div className="h-40 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
                  alt="Campus Information Silos"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a21] via-[#0d2a21]/50 to-transparent"></div>
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg backdrop-blur-sm">
                  <i className="fa-solid fa-network-wired"></i>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Campus Information Silos</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Lack of a unified, verified digital hub for intra-campus collaboration between departments and cohorts.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <i className="fa-solid fa-link-slash"></i>
                  <span>Disconnected student community</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
