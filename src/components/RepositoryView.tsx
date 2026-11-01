import React, { useState } from 'react';
import { RepoItem } from '../types';

interface RepositoryViewProps {
  items: RepoItem[];
  isLoading: boolean;
  onUpvote: (id: string) => void;
  onDownload: (item: RepoItem) => void;
  onPreview: (item: RepoItem) => void;
  onOpenUpload: () => void;
}

export const RepositoryView: React.FC<RepositoryViewProps> = ({
  items,
  isLoading,
  onUpvote,
  onDownload,
  onPreview,
  onOpenUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [activePill, setActivePill] = useState('ALL');

  // Multi-tier filtering
  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q);

    const matchesSubject = subjectFilter === 'ALL' || item.subject === subjectFilter;
    const matchesSemester = semesterFilter === 'ALL' || item.semester === semesterFilter;
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesPill = activePill === 'ALL' || item.type === activePill;

    return matchesSearch && matchesSubject && matchesSemester && matchesType && matchesPill;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSubjectFilter('ALL');
    setSemesterFilter('ALL');
    setTypeFilter('ALL');
    setActivePill('ALL');
  };

  const handlePillClick = (pill: string) => {
    setActivePill(pill);
    if (pill === 'ALL') {
      setTypeFilter('ALL');
    } else {
      setTypeFilter(pill);
    }
  };

  return (
    <div className="view-section py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <i className="fa-solid fa-layer-group"></i>
              <span>Curated Learning Archive</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Curated Academic Repository
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Study materials organized by subject, semester, and peer rating. No more buried drive links.
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="self-start md:self-auto bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Upload Material</span>
          </button>
        </div>

        {/* Search and Multi-Filter Controls Bar */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, past papers, course codes (e.g., CS101, MATH301, Differential Equations)..."
              className="w-full bg-black/40 text-white placeholder-gray-500 pl-11 pr-14 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs px-2 py-1 bg-white/5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dropdown Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Filter: Subject */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Subject Category
              </label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full bg-black/50 text-gray-200 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Subjects</option>
                <option value="Engineering Mathematics">Engineering Mathematics</option>
                <option value="Fluid Mechanics">Fluid Mechanics</option>
                <option value="C Programming">C Programming & Data Structures</option>
                <option value="Quantum Physics">Quantum Physics</option>
                <option value="Electrical Circuits">Electrical Circuits</option>
                <option value="Database Systems">Database Systems</option>
              </select>
            </div>

            {/* Filter: Semester */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Semester Level
              </label>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="w-full bg-black/50 text-gray-200 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Semesters</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
              </select>
            </div>

            {/* Filter: Material Type */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Material Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setActivePill(e.target.value);
                }}
                className="w-full bg-black/50 text-gray-200 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Material Types</option>
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Past Papers">Past Papers</option>
                <option value="Lab & Tech Manuals">Lab & Tech Manuals</option>
                <option value="Peer Summaries">Peer Summaries</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 text-xs">
            <span className="text-gray-400 text-[11px] font-semibold uppercase whitespace-nowrap">
              Quick Pills:
            </span>
            {['ALL', 'Lecture Notes', 'Past Papers', 'Lab & Tech Manuals', 'Peer Summaries'].map(
              (pill) => (
                <button
                  key={pill}
                  onClick={() => handlePillClick(pill)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition cursor-pointer ${
                    activePill === pill
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {pill === 'ALL' ? 'All Items' : pill}
                </button>
              )
            )}
          </div>
        </div>

        {/* Dynamic Academic Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-3">Loading academic archive...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between relative group border border-white/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wide">
                      {item.code} &bull; {item.semester}
                    </span>
                    <span className="badge-verified text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <i className="fa-solid fa-shield-halved text-[9px]"></i> Virus Scanned
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="truncate max-w-[160px]">
                      <i className="fa-solid fa-user-pen mr-1 text-gray-500"></i>
                      {item.author}
                    </span>
                    <span className="text-[11px] text-gray-500">{item.date}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onUpvote(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-emerald-400 border border-white/5 transition active:scale-95 cursor-pointer"
                      title="Mark as helpful"
                    >
                      <i className="fa-solid fa-thumbs-up"></i>
                      <span>{item.upvotes}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPreview(item)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/5 transition cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => onDownload(item)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <i className="fa-solid fa-download"></i>
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 glass-panel rounded-2xl mt-4">
            <i className="fa-solid fa-folder-open text-4xl text-gray-600 mb-3"></i>
            <h4 className="text-base font-semibold text-gray-300">No study resources found</h4>
            <p className="text-xs text-gray-500 mt-1">Try resetting your search query or filters.</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-500 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
