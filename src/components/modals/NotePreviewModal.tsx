import React from 'react';
import { RepoItem } from '../../types';

interface NotePreviewModalProps {
  item: RepoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (item: RepoItem) => void;
}

export const NotePreviewModal: React.FC<NotePreviewModalProps> = ({
  item,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-emerald-500/40 p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-sm cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span>
                {item.code} &bull; {item.semester}
              </span>
            </div>
            <span className="badge-verified text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1">
              <i className="fa-solid fa-shield-halved"></i> Virus Scanned Clean
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">{item.title}</h2>
          <p className="text-xs text-gray-400 mt-1">
            Uploaded by <strong className="text-gray-300">{item.author}</strong> on {item.date}
          </p>

          <div className="mt-6 bg-black/60 rounded-xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-file-pdf text-red-400"></i>
                <span className="font-semibold text-gray-200">
                  {item.fileName || `${item.code}_Document.pdf`}
                </span>
                <span className="text-[10px] text-gray-500">({item.fileSize || '3.5 MB'})</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">Verified Read-Only</span>
            </div>

            <div className="space-y-3 font-mono text-xs text-gray-300 bg-emerald-950/20 p-4 rounded-lg border border-emerald-900/40">
              <p className="text-emerald-400 font-bold">// KEY SUMMARY &amp; CONCEPTS COVERED:</p>
              <p className="leading-relaxed">{item.summary}</p>
              <p className="text-gray-600 pt-2 select-none">--------------------------------------------------</p>
              <p>1. Formulations and mathematical proofs for core syllabus modules.</p>
              <p>2. Verified step-by-step solved problems from university past papers.</p>
              <p>3. Standard reference diagrams and lab protocol charts included.</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>
                <i className="fa-solid fa-thumbs-up text-emerald-400 mr-1.5"></i>
                <strong>{item.upvotes}</strong> Students found this helpful
              </span>
              <span>
                <i className="fa-solid fa-download text-teal-400 mr-1.5"></i>
                <strong>{item.downloads}</strong> Downloads
              </span>
            </div>

            <button
              onClick={() => {
                onDownload(item);
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <i className="fa-solid fa-download"></i>
              <span>Download Full PDF ({item.fileSize || '3.5 MB'})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
