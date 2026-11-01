import React, { useState } from 'react';
import { User } from '../../types';
import { UserAvatar } from '../UserAvatar';
import { api } from '../../services/api';

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSwitchAccount: () => void;
  onUserUpdated: (user: User) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
  onSwitchAccount,
  onUserUpdated,
  onShowToast,
}) => {
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  const [savingPhoto, setSavingPhoto] = useState(false);

  if (!isOpen || !user) return null;

  const roleColor =
    user.role === 'admin'
      ? 'bg-purple-950 text-purple-300 border-purple-800'
      : user.role === 'faculty'
      ? 'bg-teal-950 text-teal-300 border-teal-800'
      : 'bg-emerald-950 text-emerald-300 border-emerald-800';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onShowToast('Please select an image smaller than 5 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (photoUrlInput.trim()) {
      setPhotoPreview(photoUrlInput.trim());
    }
  };

  const handleSavePhoto = async () => {
    setSavingPhoto(true);
    try {
      const res = await api.updateProfile({
        id: user.id,
        avatar: photoPreview,
      });

      if (res.success && res.user) {
        onUserUpdated(res.user);
        onShowToast(photoPreview ? 'Profile picture updated!' : 'Profile picture removed', 'success');
        setShowPhotoEditor(false);
        setPhotoPreview('');
        setPhotoUrlInput('');
      } else {
        onShowToast('Could not update profile picture', 'error');
      }
    } catch (err) {
      onShowToast('Failed to save profile picture', 'error');
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setSavingPhoto(true);
    try {
      const res = await api.updateProfile({
        id: user.id,
        avatar: '',
      });

      if (res.success && res.user) {
        onUserUpdated(res.user);
        onShowToast('Profile picture removed. Initials will be used.', 'info');
        setShowPhotoEditor(false);
        setPhotoPreview('');
        setPhotoUrlInput('');
      }
    } catch (err) {
      onShowToast('Failed to remove profile picture', 'error');
    } finally {
      setSavingPhoto(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-emerald-500/30 p-6 relative max-h-[92vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-sm cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5">
          <div className="relative group">
            <UserAvatar user={user} size="xl" className="border-2 border-emerald-500/50 shadow-lg" />
            <button
              onClick={() => {
                setShowPhotoEditor(!showPhotoEditor);
                setPhotoPreview(user.avatar || '');
              }}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-md border border-white/20 transition cursor-pointer"
              title="Add or change profile picture"
            >
              <i className="fa-solid fa-camera"></i>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{user.name}</h3>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase font-semibold border ${roleColor}`}>
                {user.role}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-mono mt-0.5">{user.email}</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <i className="fa-solid fa-building-columns text-[10px]"></i>
              <span>{user.department}</span>
            </p>
          </div>
        </div>

        {/* Optional Add / Change Profile Picture Section */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => {
              setShowPhotoEditor(!showPhotoEditor);
              setPhotoPreview(user.avatar || '');
            }}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-emerald-300 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-image text-emerald-400"></i>
              <span>{user.avatar ? 'Change Profile Picture' : 'Add Profile Picture (Optional)'}</span>
            </span>
            <i className={`fa-solid ${showPhotoEditor ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs text-gray-400`}></i>
          </button>

          {showPhotoEditor && (
            <div className="mt-3 p-4 bg-black/60 rounded-xl border border-emerald-500/30 space-y-3.5 animate-in fade-in">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-md"
                    />
                  ) : (
                    <UserAvatar user={{ name: user.name, role: user.role }} size="lg" />
                  )}
                  <span className="text-[10px] text-gray-400 block mt-1">Preview</span>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="block">
                    <span className="text-[11px] text-gray-300 font-semibold block mb-1">
                      Upload from Device:
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Or paste image URL */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Or paste image URL:</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    className="flex-1 bg-black/50 text-white text-xs px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold text-white rounded-xl transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                {user.avatar ? (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={savingPhoto}
                    className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    Remove Current Photo
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPhotoEditor(false);
                      setPhotoPreview('');
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePhoto}
                    disabled={savingPhoto || photoPreview === user.avatar}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition cursor-pointer shadow-md"
                  >
                    {savingPhoto ? 'Saving...' : 'Save Picture'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="bg-black/50 p-4 rounded-xl border border-white/10 space-y-2.5 text-xs text-gray-300 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Student / Staff ID:</span>
            <span className="font-mono font-semibold text-white">{user.studentId}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Account Role:</span>
            <span className="font-semibold text-emerald-400 capitalize">{user.role}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Member Since:</span>
            <span className="text-gray-400">{user.createdAt}</span>
          </div>

          {user.bio && (
            <div className="pt-2 border-t border-white/5">
              <span className="text-gray-500 block text-[11px] mb-1">Campus Bio:</span>
              <p className="text-xs text-gray-300 italic">"{user.bio}"</p>
            </div>
          )}
        </div>

        {/* Permissions summary */}
        <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl mb-6 text-[11px] space-y-1 text-gray-300">
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <i className="fa-solid fa-shield-halved text-xs"></i>
            <span>Active Permissions</span>
          </span>
          <p className="text-gray-400">
            {user.role === 'admin'
              ? 'Full platform administrative access, user directory management, and direct database write permissions.'
              : user.role === 'faculty'
              ? 'Authorized to publish verified department circulars, endorse study materials, and moderate items.'
              : 'Authorized to contribute lecture notes, report lost & found items, submit claims, and upvote.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onSwitchAccount();
            }}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 transition flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-repeat text-amber-400"></i>
            <span>Switch Account</span>
          </button>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold border border-red-500/40 transition flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
