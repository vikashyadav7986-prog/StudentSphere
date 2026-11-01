import React, { useState } from 'react';
import { Announcement } from '../../types';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Announcement>) => void;
  defaultDept?: string;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ isOpen, onClose, onSubmit, defaultDept }) => {
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState(defaultDept || '');
  const [tag, setTag] = useState<'Academic Notice' | 'Campus Event' | 'Facility Update'>('Academic Notice');
  const [body, setBody] = useState('');

  React.useEffect(() => {
    if (defaultDept && isOpen) setDept(defaultDept);
  }, [defaultDept, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dept || !body) return;

    onSubmit({
      title,
      dept,
      tag,
      body,
    });

    setTitle('');
    setDept('');
    setBody('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-teal-500/30 p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-sm cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-500/30 text-teal-400 flex items-center justify-center text-lg">
            <i className="fa-solid fa-bullhorn"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Post Campus Announcement</h3>
            <p className="text-xs text-gray-400">Share updates with the campus community.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Announcement Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Mid-Term Examination Seating Plan"
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Department / Organization *
              </label>
              <input
                type="text"
                required
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="e.g., Academic Affairs Office"
                className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Category Tag *
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as any)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-teal-500"
              >
                <option value="Academic Notice">Academic Notice</option>
                <option value="Campus Event">Campus Event</option>
                <option value="Facility Update">Facility Update</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Announcement Body *
            </label>
            <textarea
              rows={4}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Provide clear details regarding dates, room allocations, or instructions..."
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-teal-500"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/20 cursor-pointer active:scale-95"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
