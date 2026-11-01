import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { api } from '../../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await api.login(email);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onShowToast(`Welcome back, ${res.user.name}!`, 'success');
        onClose();
      } else {
        onShowToast('Could not sign in with this email', 'error');
      }
    } catch (err) {
      onShowToast('Sign in failed. Check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    try {
      const res = await api.register({
        name,
        email,
        role,
        department,
        studentId: studentId || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onShowToast(`Account created! Welcome to StudentSphere, ${res.user.name}.`, 'success');
        onClose();
      }
    } catch (err) {
      onShowToast('Registration failed. Please try a different email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-emerald-500/30 p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-sm cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white text-xl">
            <i className="fa-solid fa-id-card-clip"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">StudentSphere Access</h3>
            <p className="text-xs text-gray-400">Sign in to your university campus account.</p>
          </div>
        </div>

        {/* Auth Mode Tabs: Only Sign In and Register */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 mb-5 text-xs">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-right-to-bracket text-[11px]"></i>
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-user-plus text-[11px]"></i>
            <span>Register</span>
          </button>
        </div>

        {/* SIGN IN FORM (No placeholders or text inside boxes) */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                University Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Password / Portal PIN
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        {/* REGISTER NEW ACCOUNT FORM (No placeholders or text inside boxes) */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                University Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Campus Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Member</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Student / Staff ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Department / Program *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-black/50 text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
              >
                <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                <option value="Mechanical & Aerospace">Mechanical &amp; Aerospace</option>
                <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                <option value="Applied Physics & Mathematics">Applied Physics &amp; Mathematics</option>
                <option value="Biotechnology & Chemistry">Biotechnology &amp; Chemistry</option>
                <option value="Office of Academic Affairs">Office of Academic Affairs</option>
              </select>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
