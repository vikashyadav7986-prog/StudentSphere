import React, { useState } from 'react';
import { LostFoundItem, PlatformStats } from '../types';

interface LostFoundViewProps {
  items: LostFoundItem[];
  isLoading: boolean;
  onOpenReport: () => void;
  onOpenClaim: (item: LostFoundItem) => void;
  onStatusChange: (id: string, status: 'Lost' | 'Claimed' | 'Returned') => void;
  stats?: PlatformStats;
}

export const LostFoundView: React.FC<LostFoundViewProps> = ({
  items,
  isLoading,
  onOpenReport,
  onOpenClaim,
  onStatusChange,
  stats,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'Lost' | 'Claimed' | 'Returned'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [zoneFilter, setZoneFilter] = useState('ALL');

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.zone.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesZone = zoneFilter === 'ALL' || item.zone === zoneFilter;
    const matchesTab = activeTab === 'ALL' || item.status === activeTab;

    return matchesSearch && matchesCategory && matchesZone && matchesTab;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setZoneFilter('ALL');
    setActiveTab('ALL');
  };

  return (
    <div className="view-section py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <i className="fa-solid fa-bullseye"></i>
              <span>Campus Recovery Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Lost & Found Engine
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              A structured workflow converting vague notices into verified item recovery in hours.
            </p>
          </div>

          <button
            onClick={onOpenReport}
            className="self-start md:self-auto bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-amber-600/20 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-plus-circle"></i>
            <span>Report Lost or Found Item</span>
          </button>
        </div>

        {/* EMBEDDED METRICS BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel p-5 rounded-2xl text-center border-l-4 border-l-amber-500 shadow-md">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              &lt; 24h
            </div>
            <div className="text-xs sm:text-sm text-amber-400 font-semibold mt-1">
              Average Claim Time
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Average time to claim verified items
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl text-center border-l-4 border-l-emerald-400 shadow-md">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {stats?.resolutionRate || 89}%
            </div>
            <div className="text-xs sm:text-sm text-emerald-400 font-semibold mt-1">
              Resolution Success Rate
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Resolution rate for listed devices
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl text-center border-l-4 border-l-teal-400 shadow-md">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              0
            </div>
            <div className="text-xs sm:text-sm text-teal-400 font-semibold mt-1">
              Dead-End Flyers
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Paper flyers taped across campus
            </div>
          </div>
        </div>

        {/* 3 Step Process Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-amber-500 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
              01
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Report with Visual Proof</h4>
              <p className="text-xs text-gray-400 mt-0.5">Upload photos & record exact hall location.</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-emerald-500 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
              02
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Search & Precision Filter</h4>
              <p className="text-xs text-gray-400 mt-0.5">Filter immediately by campus zone & category.</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-teal-400 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm shrink-0">
              03
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Coordinate Safe Return</h4>
              <p className="text-xs text-gray-400 mt-0.5">Direct handoff or designated desk claim.</p>
            </div>
          </div>
        </div>

        {/* Filter Controls and Status Tabs */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl mb-8 space-y-4">
          {/* Status Tab Switching */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
            {(['ALL', 'Lost', 'Claimed', 'Returned'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                {tab === 'ALL'
                  ? 'All Notices'
                  : tab === 'Lost'
                  ? 'Lost Items'
                  : tab === 'Claimed'
                  ? 'Claim Pending'
                  : 'Returned'}
              </button>
            ))}
          </div>

          {/* Search and Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items (e.g. MacBook, Wallet, ID Card)..."
                className="w-full bg-black/40 text-white placeholder-gray-500 pl-9 pr-3 py-2 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black/50 text-gray-200 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Electronics">Electronics & Gadgets</option>
              <option value="ID & Keys">ID Cards & Keys</option>
              <option value="Books & Notes">Books & Notebooks</option>
              <option value="Personal Items">Personal Belongings</option>
            </select>

            {/* Campus Zone Filter */}
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="bg-black/50 text-gray-200 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Campus Zones</option>
              <option value="Central Library">Central Library</option>
              <option value="Engineering Block A">Engineering Block A</option>
              <option value="Science Complex">Science Complex</option>
              <option value="Main Cafeteria">Main Cafeteria</option>
              <option value="Sports Complex">Sports Complex</option>
            </select>
          </div>
        </div>

        {/* Dynamic Lost & Found Cards Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-3">Loading item reports...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              let statusBadge = null;
              if (item.status === 'Lost') {
                statusBadge = (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                    <span>Lost Item</span>
                  </span>
                );
              } else if (item.status === 'Claimed') {
                statusBadge = (
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-clock text-[9px]"></i>
                    <span>Claim Pending</span>
                  </span>
                );
              } else {
                statusBadge = (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
                    <i className="fa-solid fa-circle-check text-[10px]"></i>
                    <span>Returned</span>
                  </span>
                );
              }

              return (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`h-32 bg-gradient-to-br ${item.imageBg} relative flex items-center justify-center p-4`}
                    >
                      <i className={`fa-solid ${item.imageIcon} text-5xl text-white/30`}></i>
                      <div className="absolute top-3 left-3">{statusBadge}</div>
                      <span className="absolute bottom-3 right-3 text-[10px] bg-black/60 backdrop-blur-sm text-gray-300 px-2 py-1 rounded-md border border-white/10">
                        <i className="fa-solid fa-location-dot text-amber-400 mr-1"></i>
                        {item.zone}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-white leading-tight">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                        <span>
                          <i className="fa-solid fa-user text-gray-500 mr-1"></i>
                          {item.reporter}
                        </span>
                        <span>
                          <i className="fa-solid fa-clock text-gray-500 mr-1"></i>
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-1 space-y-2">
                    <button
                      onClick={() => onOpenClaim(item)}
                      className="w-full py-2.5 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <i className="fa-solid fa-comments"></i>
                      <span>Contact Finder / Claim Item</span>
                    </button>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-gray-500">Toggle Status:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onStatusChange(item.id, 'Lost')}
                          className={`px-2 py-0.5 rounded transition cursor-pointer ${
                            item.status === 'Lost'
                              ? 'bg-red-500/30 text-red-300 font-bold'
                              : 'bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400'
                          }`}
                        >
                          Lost
                        </button>
                        <button
                          onClick={() => onStatusChange(item.id, 'Claimed')}
                          className={`px-2 py-0.5 rounded transition cursor-pointer ${
                            item.status === 'Claimed'
                              ? 'bg-amber-500/30 text-amber-300 font-bold'
                              : 'bg-white/5 hover:bg-amber-500/20 text-gray-400 hover:text-amber-400'
                          }`}
                        >
                          Claimed
                        </button>
                        <button
                          onClick={() => onStatusChange(item.id, 'Returned')}
                          className={`px-2 py-0.5 rounded transition cursor-pointer ${
                            item.status === 'Returned'
                              ? 'bg-emerald-500/30 text-emerald-300 font-bold'
                              : 'bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400'
                          }`}
                        >
                          Returned
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 glass-panel rounded-2xl mt-4">
            <i className="fa-solid fa-circle-question text-4xl text-gray-600 mb-3"></i>
            <h4 className="text-base font-semibold text-gray-300">
              No lost or found items match your filter
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Try switching status tabs or resetting category filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-xl hover:bg-amber-500 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
