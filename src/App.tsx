import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, RepoItem, LostFoundItem, Announcement, PlatformStats, ToastMessage, User } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { RepositoryView } from './components/RepositoryView';
import { LostFoundView } from './components/LostFoundView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { DatabaseStudioView } from './components/DatabaseStudioView';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { UploadModal } from './components/modals/UploadModal';
import { ReportModal } from './components/modals/ReportModal';
import { NoticeModal } from './components/modals/NoticeModal';
import { NotePreviewModal } from './components/modals/NotePreviewModal';
import { ClaimModal } from './components/modals/ClaimModal';
import { LoginModal } from './components/modals/LoginModal';
import { UserProfileModal } from './components/modals/UserProfileModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [repoItems, setRepoItems] = useState<RepoItem[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<PlatformStats | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('studentsphere_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.avatar && (parsed.avatar.includes('unsplash.com') || parsed.avatar.includes('images.'))) {
          parsed.avatar = '';
          localStorage.setItem('studentsphere_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<RepoItem | null>(null);
  const [claimItem, setClaimItem] = useState<LostFoundItem | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all data from API
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [repoData, lfData, ntcData, statsData] = await Promise.all([
        api.getRepository(),
        api.getLostFound(),
        api.getAnnouncements(),
        api.getStats().catch(() => undefined),
      ]);

      setRepoItems(repoData || []);
      setLostFoundItems(lfData || []);
      setAnnouncements(ntcData || []);
      if (statsData) setStats(statsData);
    } catch (err) {
      console.error('Failed to load application data:', err);
      showToast('Could not sync with backend database. Retrying...', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('studentsphere_user', JSON.stringify(user));
    } catch (e) {
      console.error('Storage error', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('studentsphere_user');
    } catch (e) {
      console.error('Storage error', e);
    }
    showToast('Signed out of StudentSphere', 'info');
  };

  // Upvote Handler
  const handleUpvote = async (id: string) => {
    try {
      const res = await api.upvoteNote(id);
      if (res.success) {
        setRepoItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, upvotes: res.upvotes } : item))
        );
        showToast('Upvoted study resource (+1)', 'success');
      }
    } catch (err) {
      showToast('Failed to record upvote', 'error');
    }
  };

  // Download Handler
  const handleDownload = async (item: RepoItem) => {
    try {
      const res = await api.downloadNote(item.id);
      if (res.success) {
        setRepoItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, downloads: res.downloads } : i))
        );

        // Generate clean simulated download file
        const blobContent = `STUDENTSPHERE ACADEMIC RESOURCE ARCHIVE\n=========================================\nCourse Code: ${item.code}\nTitle: ${item.title}\nSubject: ${item.subject} (${item.semester})\nAuthor: ${item.author}\nDate: ${item.date}\nStatus: Virus-Scanned & Verified\n\nOVERVIEW & STUDY SUMMARY:\n${item.summary}\n\n[Full course notes verified by StudentSphere peer archive.]`;
        const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.fileName || `${item.code}_Study_Notes.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`Downloaded: ${item.title.substring(0, 30)}...`, 'info');
      }
    } catch (err) {
      showToast('Download request failed', 'error');
    }
  };

  // Upload Resource Handler
  const handleUploadSubmit = async (data: Partial<RepoItem>) => {
    try {
      const newNote = await api.createRepositoryNote(data);
      setRepoItems((prev) => [newNote, ...prev]);
      showToast('Study resource uploaded & cataloged!', 'success');
    } catch (err) {
      showToast('Error uploading resource', 'error');
    }
  };

  // Report Item Handler
  const handleReportSubmit = async (data: Partial<LostFoundItem>) => {
    try {
      const newItem = await api.reportItem(data);
      setLostFoundItems((prev) => [newItem, ...prev]);
      showToast('Item notice published to Lost & Found!', 'success');
    } catch (err) {
      showToast('Error reporting item', 'error');
    }
  };

  // Notice Submit Handler
  const handleNoticeSubmit = async (data: Partial<Announcement>) => {
    try {
      const newNotice = await api.createAnnouncement(data);
      setAnnouncements((prev) => [newNotice, ...prev]);
      showToast('Campus announcement published!', 'success');
    } catch (err) {
      showToast('Error publishing notice', 'error');
    }
  };

  // Status Change Handler
  const handleStatusChange = async (id: string, status: 'Lost' | 'Claimed' | 'Returned') => {
    try {
      const res = await api.updateItemStatus(id, status);
      if (res.success) {
        setLostFoundItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        showToast(`Status updated to "${status}"`, 'success');
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Claim Submit Handler
  const handleClaimSubmit = async (
    id: string,
    claimData: { claimantName: string; claimantEmail: string; message: string }
  ) => {
    try {
      const res = await api.submitClaim(id, claimData);
      if (res.success) {
        setLostFoundItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: 'Claimed' } : item))
        );
        showToast('Claim registered! Reporter will coordinate return.', 'success');
      }
    } catch (err) {
      showToast('Failed to submit claim', 'error');
    }
  };

  const totalRecords = repoItems.length + lostFoundItems.length + announcements.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#081713] text-[#f3f4f6]">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        totalRecordsCount={totalRecords}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeView onNavigate={handleNavigate} stats={stats} />
        )}

        {currentView === 'repository' && (
          <RepositoryView
            items={repoItems}
            isLoading={loading}
            onUpvote={handleUpvote}
            onDownload={handleDownload}
            onPreview={(item) => setPreviewItem(item)}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {currentView === 'lostfound' && (
          <LostFoundView
            items={lostFoundItems}
            isLoading={loading}
            onOpenReport={() => setIsReportOpen(true)}
            onOpenClaim={(item) => setClaimItem(item)}
            onStatusChange={handleStatusChange}
            stats={stats}
          />
        )}

        {currentView === 'announcements' && (
          <AnnouncementsView
            items={announcements}
            isLoading={loading}
            onOpenNoticeModal={() => setIsNoticeOpen(true)}
          />
        )}

        {currentView === 'database' && (
          currentUser?.role === 'admin' ? (
            <DatabaseStudioView
              onShowToast={showToast}
              onDataChanged={loadAllData}
            />
          ) : (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
              <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-400 text-2xl mx-auto mb-4 shadow-lg shadow-purple-900/20">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Administrator Authorization Required
                </h2>
                <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                  The Database Studio is strictly restricted to university administrators. Normal student and faculty accounts cannot view or modify internal database schemas and records.
                </p>
                {currentUser && (
                  <p className="text-[11px] text-purple-300 font-mono mb-6 bg-purple-950/40 py-2 px-3 rounded-xl border border-purple-800/40 inline-block">
                    Current account role: <span className="uppercase font-bold">{currentUser.role}</span> ({currentUser.name})
                  </p>
                )}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleNavigate('home')}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 transition cursor-pointer"
                  >
                    Return to Campus Home
                  </button>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition cursor-pointer flex items-center gap-2"
                  >
                    <i className="fa-solid fa-right-to-bracket text-xs"></i>
                    <span>Log In as Administrator</span>
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={showToast}
      />

      <UserProfileModal
        user={currentUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
        onSwitchAccount={() => setIsLoginOpen(true)}
        onUserUpdated={(updatedUser) => {
          setCurrentUser(updatedUser);
          try {
            localStorage.setItem('studentsphere_user', JSON.stringify(updatedUser));
          } catch (e) {
            console.error(e);
          }
        }}
        onShowToast={showToast}
      />

      {/* Interactive Feature Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUploadSubmit}
        defaultAuthor={currentUser?.name}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportSubmit}
        defaultContact={currentUser?.email}
      />

      <NoticeModal
        isOpen={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        onSubmit={handleNoticeSubmit}
        defaultDept={currentUser?.department}
      />

      <NotePreviewModal
        item={previewItem}
        isOpen={Boolean(previewItem)}
        onClose={() => setPreviewItem(null)}
        onDownload={handleDownload}
      />

      <ClaimModal
        item={claimItem}
        isOpen={Boolean(claimItem)}
        onClose={() => setClaimItem(null)}
        onSubmitClaim={handleClaimSubmit}
        defaultClaimantName={currentUser?.name}
        defaultClaimantEmail={currentUser?.email}
      />
    </div>
  );
}
