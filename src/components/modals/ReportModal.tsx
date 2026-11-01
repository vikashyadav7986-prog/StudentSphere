import React, { useState } from 'react';
import { LostFoundItem } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LostFoundItem>) => void;
  defaultContact?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, defaultContact }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'Lost' | 'Claimed'>('Lost');
  const [category, setCategory] = useState('Electronics');
  const [zone, setZone] = useState('Central Library');
  const [time, setTime] = useState('');
  const [desc, setDesc] = useState('');
  const [contact, setContact] = useState(defaultContact || '');

  React.useEffect(() => {
    if (defaultContact && isOpen) setContact(defaultContact);
  }, [defaultContact, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !contact) return;

    onSubmit({
      title,
      status,
      category,
      zone,
      time: time || 'Today at 11:30 AM',
      desc,
      contact,
    });

    setTitle('');
    setTime('');
    setDesc('');
    setContact('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-amber-500/30 p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-sm cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-lg">
            <i className="fa-solid fa-bullseye"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Report Lost or Found Item</h3>
            <p className="text-xs text-gray-400">Record visual proof, hall location &amp; date/time.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Item Title &amp; Brand *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Space Gray Laptop with stickers"
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Status Type *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Lost' | 'Claimed')}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
              >
                <option value="Lost">I Lost This Item</option>
                <option value="Claimed">Found (Looking for Owner)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
              >
                <option value="Electronics">Electronics &amp; Gadgets</option>
                <option value="ID &amp; Keys">ID Cards &amp; Keys</option>
                <option value="Books &amp; Notes">Books &amp; Notebooks</option>
                <option value="Personal Items">Personal Belongings</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Campus Building / Zone *
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
              >
                <option value="Central Library">Central Library</option>
                <option value="Engineering Block A">Engineering Block A</option>
                <option value="Science Complex">Science Complex</option>
                <option value="Main Cafeteria">Main Cafeteria</option>
                <option value="Sports Complex">Sports Complex</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Date &amp; Time *
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., Today at 11:30 AM"
                className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Item Description &amp; Marks *
            </label>
            <textarea
              rows={3}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe specific details, color, scratches or unique markings..."
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Contact Email / Handle *
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="e.g., student.handle@univ.edu"
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
            />
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
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 cursor-pointer active:scale-95"
            >
              Submit Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
