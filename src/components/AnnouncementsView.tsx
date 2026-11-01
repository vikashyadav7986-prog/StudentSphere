import React, { useState } from 'react';
import { Announcement } from '../types';

interface AnnouncementsViewProps {
  items: Announcement[];
  isLoading: boolean;
  onOpenNoticeModal: () => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  items,
  isLoading,
  onOpenNoticeModal,
}) => {
  const [activeTag, setActiveTag] = useState<string>('ALL');

  const filteredItems = items.filter((item) => {
    if (activeTag === 'ALL') return true;
    return item.tag === activeTag;
  });

  return (
    <div className="view-section py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <i className="fa-solid fa-bullhorn"></i>
              <span>Centralized Campus Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Campus Announcements
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Verified department notices, exam circulars, and departmental updates.
            </p>
          </div>

          <button
            onClick={onOpenNoticeModal}
            className="self-start md:self-auto bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-teal-600/20 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Post Notice</span>
          </button>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto mb-8 pb-1 text-xs">
          <span className="text-gray-400 text-[11px] font-semibold uppercase whitespace-nowrap">
            Filter Tag:
          </span>
          {['ALL', 'Academic Notice', 'Campus Event', 'Facility Update'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs transition cursor-pointer ${
                activeTag === tag
                  ? 'bg-teal-600 text-white font-semibold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {tag === 'ALL' ? 'All Notices' : tag}
            </button>
          ))}
        </div>

        {/* Announcements Feed Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-3">Loading campus announcements...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                      {item.tag}
                    </span>
                    <span className="text-[11px] text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.body}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">
                    <i className="fa-solid fa-building-columns text-teal-400 mr-1.5"></i>
                    {item.dept}
                  </span>
                  <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-panel rounded-2xl mt-4">
            <i className="fa-solid fa-bullhorn text-4xl text-gray-600 mb-3"></i>
            <h4 className="text-base font-semibold text-gray-300">No announcements in this category</h4>
            <p className="text-xs text-gray-500 mt-1">Try switching to "All Notices" to see more.</p>
            <button
              onClick={() => setActiveTag('ALL')}
              className="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-500 transition cursor-pointer"
            >
              Show All Notices
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
