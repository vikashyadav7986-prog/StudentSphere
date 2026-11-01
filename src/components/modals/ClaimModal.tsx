import React, { useState } from 'react';
import { LostFoundItem } from '../../types';

interface ClaimModalProps {
  item: LostFoundItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (id: string, claimData: { claimantName: string; claimantEmail: string; message: string }) => void;
  defaultClaimantName?: string;
  defaultClaimantEmail?: string;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmitClaim,
  defaultClaimantName,
  defaultClaimantEmail,
}) => {
  const [claimantName, setClaimantName] = useState(defaultClaimantName || '');
  const [claimantEmail, setClaimantEmail] = useState(defaultClaimantEmail || '');
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    if (defaultClaimantName && isOpen) setClaimantName(defaultClaimantName);
    if (defaultClaimantEmail && isOpen) setClaimantEmail(defaultClaimantEmail);
  }, [defaultClaimantName, defaultClaimantEmail, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName || !claimantEmail) return;

    onSubmitClaim(item.id, {
      claimantName,
      claimantEmail,
      message: message || 'I believe this is my item. Please coordinate handoff.',
    });

    setClaimantName('');
    setClaimantEmail('');
    setMessage('');
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
            <i className="fa-solid fa-comments"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Contact Finder / Claim Item</h3>
            <p className="text-xs text-gray-400">Coordinate secure item verification &amp; campus handoff.</p>
          </div>
        </div>

        {/* Item Summary Banner */}
        <div className="bg-black/50 p-4 rounded-xl border border-white/10 mb-4 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">{item.title}</span>
            <span className="text-amber-400 font-mono text-[11px]">{item.zone}</span>
          </div>
          <p className="text-xs text-gray-400">{item.desc}</p>
          <div className="text-[11px] text-gray-500 pt-1 border-t border-white/5 flex items-center justify-between">
            <span>Reported by: {item.reporter}</span>
            <span className="text-emerald-400">Desk: {item.contact}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={claimantName}
              onChange={(e) => setClaimantName(e.target.value)}
              placeholder="e.g., Alex Chen"
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Student University Email / ID *
            </label>
            <input
              type="email"
              required
              value={claimantEmail}
              onChange={(e) => setClaimantEmail(e.target.value)}
              placeholder="e.g., a.chen@university.edu"
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Proof of Ownership or Message to Finder *
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe distinguishing identifiers, passcode, serial number, or where you last used it..."
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500"
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
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 cursor-pointer active:scale-95"
            >
              Submit Claim Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
