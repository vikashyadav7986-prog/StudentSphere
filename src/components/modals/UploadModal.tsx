import React, { useState } from 'react';
import { RepoItem } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<RepoItem>) => void;
  defaultAuthor?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSubmit, defaultAuthor }) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [subject, setSubject] = useState('Engineering Mathematics');
  const [type, setType] = useState('Lecture Notes');
  const [author, setAuthor] = useState(defaultAuthor || '');
  const [summary, setSummary] = useState('');
  const [fileName, setFileName] = useState('');

  React.useEffect(() => {
    if (defaultAuthor && isOpen) setAuthor(defaultAuthor);
  }, [defaultAuthor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    onSubmit({
      title,
      code: code.toUpperCase(),
      semester,
      subject,
      type,
      author: author || 'Student Contributor',
      summary: summary || 'Comprehensive verified study material for module preparation.',
      fileName: fileName || `${code.toUpperCase()}_Notes.pdf`,
    });

    // Reset fields
    setTitle('');
    setCode('');
    setAuthor('');
    setSummary('');
    setFileName('');
    onClose();
  };

  const handleSimulatedFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-emerald-500/30 p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-sm cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg">
            <i className="fa-solid fa-cloud-arrow-up"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Upload Study Resource</h3>
            <p className="text-xs text-gray-400">Contribute verified lecture notes, past papers, or lab manuals.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Title / Resource Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Differential Equations - Solved Module Notes"
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., MATH301"
                className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Semester Level *
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Subject Category *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
              >
                <option value="Engineering Mathematics">Engineering Mathematics</option>
                <option value="Fluid Mechanics">Fluid Mechanics</option>
                <option value="C Programming">C Programming &amp; Data Structures</option>
                <option value="Quantum Physics">Quantum Physics</option>
                <option value="Electrical Circuits">Electrical Circuits</option>
                <option value="Database Systems">Database Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Material Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
              >
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Past Papers">Past Papers</option>
                <option value="Lab & Tech Manuals">Lab &amp; Tech Manuals</option>
                <option value="Peer Summaries">Peer Summaries</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Contributor Handle / Name *
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Campus Academic Lead"
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Summary / Key Concepts Covered
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Highlight topics, derivations, or problem sets included..."
              className="w-full bg-black/50 text-white placeholder-gray-500 text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          {/* Drag & Drop PDF Zone */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Attach PDF File *
            </label>
            <label className="border-2 border-dashed border-white/20 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer bg-black/30 transition block">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleSimulatedFileDrop}
                className="hidden"
              />
              <i className="fa-solid fa-file-pdf text-2xl text-red-400 mb-1"></i>
              <p className="text-xs text-gray-300 font-medium">
                {fileName ? `Attached: ${fileName}` : 'Click or drop PDF document here'}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Automated virus scan will process file upon publishing
              </p>
            </label>
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
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 cursor-pointer active:scale-95"
            >
              Upload &amp; Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
