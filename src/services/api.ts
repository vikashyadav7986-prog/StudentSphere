import { RepoItem, LostFoundItem, Announcement, DatabaseOverview, PlatformStats, User } from '../types';
import { fallbackSeedData, FallbackDatabase } from '../data/fallbackData';

// Helper for static fallback on GitHub Pages or offline hosting
function getLocalDb(): FallbackDatabase {
  try {
    const raw = localStorage.getItem('studentsphere_static_db');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.repository && parsed.lost_found && parsed.announcements) {
        return parsed;
      }
    }
  } catch {}
  const fresh = JSON.parse(JSON.stringify(fallbackSeedData));
  saveLocalDb(fresh);
  return fresh;
}

function saveLocalDb(db: FallbackDatabase) {
  try {
    localStorage.setItem('studentsphere_static_db', JSON.stringify(db));
  } catch {}
}

export const api = {
  // Authentication & Users
  async getDemoAccounts(): Promise<User[]> {
    try {
      const res = await fetch('/api/auth/demo-accounts');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}
    const db = getLocalDb();
    return db.users.slice(0, 3);
  },

  async login(email: string): Promise<{ success: boolean; user: User; token: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    // Fallback for static environments (GitHub Pages)
    const db = getLocalDb();
    const normalized = email.toLowerCase().trim();
    let user = db.users.find(u => u.email.toLowerCase() === normalized);
    if (!user) {
      const derivedName = normalized.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase());
      user = {
        id: `usr-${Date.now()}`,
        name: derivedName || 'Campus Student',
        email: normalized,
        role: 'student',
        department: 'General Academics',
        studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        avatar: '',
        bio: 'University campus member.',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      db.users.push(user);
      saveLocalDb(db);
    }
    return { success: true, user, token: `token-${user.id}-${Date.now()}` };
  },

  async register(data: Partial<User>): Promise<{ success: boolean; user: User; token: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const normalized = (data.email || '').toLowerCase().trim();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name || 'Campus Member',
      email: normalized,
      role: data.role || 'student',
      department: data.department || 'General Academics',
      studentId: data.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: data.avatar || '',
      bio: `${(data.role || 'student').toUpperCase()} member in ${data.department || 'General Academics'}.`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    db.users.unshift(newUser);
    saveLocalDb(db);
    return { success: true, user: newUser, token: `token-${newUser.id}-${Date.now()}` };
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}
    const db = getLocalDb();
    return db.users;
  },

  async updateProfile(data: { id: string; avatar?: string; bio?: string; department?: string; studentId?: string; name?: string }): Promise<{ success: boolean; user: User }> {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const user = db.users.find(u => u.id === data.id);
    if (!user) {
      throw new Error('User not found');
    }
    if (data.avatar !== undefined) user.avatar = data.avatar;
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.department !== undefined) user.department = data.department;
    if (data.studentId !== undefined) user.studentId = data.studentId;
    if (data.name !== undefined) user.name = data.name;
    saveLocalDb(db);
    return { success: true, user };
  },

  // Platform Stats
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}
    return {
      status: 'healthy',
      mode: 'client_hybrid_storage',
      storage: 'browser_persistence',
      timestamp: new Date().toISOString()
    };
  },

  async getStats(): Promise<PlatformStats> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const totalNotes = db.repository.length;
    const totalDownloads = db.repository.reduce((acc, n) => acc + (n.downloads || 0), 0);
    const totalUpvotes = db.repository.reduce((acc, n) => acc + (n.upvotes || 0), 0);
    const totalItems = db.lost_found.length;
    const returnedItems = db.lost_found.filter(i => i.status === 'Returned').length;
    const pendingItems = db.lost_found.filter(i => i.status === 'Claimed').length;
    const resolutionRate = totalItems > 0 ? Math.round((returnedItems / totalItems) * 100) : 89;

    return {
      totalNotes,
      totalDownloads,
      totalUpvotes,
      totalItems,
      returnedItems,
      pendingItems,
      resolutionRate: resolutionRate || 89,
      averageClaimTimeHours: 18,
      activeFlyersPrevented: totalItems * 12
    };
  },

  // Academic Repository
  async getRepository(filters?: { query?: string; subject?: string; semester?: string; type?: string }): Promise<RepoItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.query) params.append('query', filters.query);
      if (filters?.subject && filters.subject !== 'ALL') params.append('subject', filters.subject);
      if (filters?.semester && filters.semester !== 'ALL') params.append('semester', filters.semester);
      if (filters?.type && filters.type !== 'ALL') params.append('type', filters.type);

      const res = await fetch(`/api/repository?${params.toString()}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    // Static fallback
    const db = getLocalDb();
    let results = [...db.repository];
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q)
      );
    }
    if (filters?.subject && filters.subject !== 'ALL') results = results.filter(i => i.subject === filters.subject);
    if (filters?.semester && filters.semester !== 'ALL') results = results.filter(i => i.semester === filters.semester);
    if (filters?.type && filters.type !== 'ALL') results = results.filter(i => i.type === filters.type);
    return results;
  },

  async createRepositoryNote(data: Partial<RepoItem>): Promise<RepoItem> {
    try {
      const res = await fetch('/api/repository', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const newNote: RepoItem = {
      id: `rep-${Date.now()}`,
      title: data.title || 'Untitled Note',
      code: (data.code || 'GEN101').toUpperCase(),
      subject: data.subject || 'General Engineering',
      semester: data.semester || 'Semester 1',
      type: data.type || 'Lecture Notes',
      author: data.author || 'Student Contributor',
      upvotes: 1,
      downloads: 0,
      virusChecked: true,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: 'fa-file-lines',
      summary: data.summary || 'Peer-contributed study material.',
      fileName: data.fileName || `${(data.code || 'NOTE').toUpperCase()}_Material.pdf`,
      fileSize: '3.5 MB'
    };
    db.repository.unshift(newNote);
    saveLocalDb(db);
    return newNote;
  },

  async upvoteNote(id: string): Promise<{ success: boolean; upvotes: number; item: RepoItem }> {
    try {
      const res = await fetch(`/api/repository/${id}/upvote`, { method: 'POST' });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const item = db.repository.find(i => i.id === id);
    if (item) {
      item.upvotes += 1;
      saveLocalDb(db);
      return { success: true, upvotes: item.upvotes, item };
    }
    throw new Error('Item not found');
  },

  async downloadNote(id: string): Promise<{ success: boolean; downloads: number; item: RepoItem }> {
    try {
      const res = await fetch(`/api/repository/${id}/download`, { method: 'POST' });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const item = db.repository.find(i => i.id === id);
    if (item) {
      item.downloads += 1;
      saveLocalDb(db);
      return { success: true, downloads: item.downloads, item };
    }
    throw new Error('Item not found');
  },

  async deleteRepositoryNote(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/repository/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch {}

    const db = getLocalDb();
    db.repository = db.repository.filter(i => i.id !== id);
    saveLocalDb(db);
    return { success: true };
  },

  // Lost & Found
  async getLostFound(filters?: { query?: string; category?: string; zone?: string; status?: string }): Promise<LostFoundItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.query) params.append('query', filters.query);
      if (filters?.category && filters.category !== 'ALL') params.append('category', filters.category);
      if (filters?.zone && filters.zone !== 'ALL') params.append('zone', filters.zone);
      if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);

      const res = await fetch(`/api/lost-found?${params.toString()}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    let results = [...db.lost_found];
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.desc.toLowerCase().includes(q) ||
        i.zone.toLowerCase().includes(q)
      );
    }
    if (filters?.category && filters.category !== 'ALL') results = results.filter(i => i.category === filters.category);
    if (filters?.zone && filters.zone !== 'ALL') results = results.filter(i => i.zone === filters.zone);
    if (filters?.status && filters.status !== 'ALL') results = results.filter(i => i.status === filters.status);
    return results;
  },

  async reportItem(data: Partial<LostFoundItem>): Promise<LostFoundItem> {
    try {
      const res = await fetch('/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const newItem: LostFoundItem = {
      id: `lf-${Date.now()}`,
      title: data.title || 'Untitled Item',
      category: data.category || 'Personal Items',
      zone: data.zone || 'Central Library',
      time: data.time || 'Today',
      status: data.status || 'Lost',
      reporter: 'Campus Reporter',
      contact: data.contact || 'student@univ.edu',
      imageBg: data.status === 'Lost' ? 'from-red-900 to-black' : 'from-amber-800 to-stone-900',
      imageIcon: 'fa-box',
      desc: data.desc || 'Reported on StudentSphere campus platform.'
    };
    db.lost_found.unshift(newItem);
    saveLocalDb(db);
    return newItem;
  },

  async updateItemStatus(id: string, status: 'Lost' | 'Claimed' | 'Returned'): Promise<{ success: boolean; item: LostFoundItem }> {
    try {
      const res = await fetch(`/api/lost-found/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const item = db.lost_found.find(i => i.id === id);
    if (item) {
      item.status = status;
      saveLocalDb(db);
      return { success: true, item };
    }
    throw new Error('Item not found');
  },

  async submitClaim(id: string, claimData: { claimantName: string; claimantEmail: string; message: string }) {
    try {
      const res = await fetch(`/api/lost-found/${id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const item = db.lost_found.find(i => i.id === id);
    if (item) {
      item.claimedBy = `${claimData.claimantName} (${claimData.claimantEmail})`;
      item.claimNotes = claimData.message;
      item.status = 'Claimed';
      saveLocalDb(db);
      return { success: true, message: 'Claim registered', item };
    }
    throw new Error('Item not found');
  },

  async deleteLostFoundItem(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/lost-found/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch {}

    const db = getLocalDb();
    db.lost_found = db.lost_found.filter(i => i.id !== id);
    saveLocalDb(db);
    return { success: true };
  },

  // Announcements
  async getAnnouncements(tag?: string): Promise<Announcement[]> {
    try {
      const params = new URLSearchParams();
      if (tag && tag !== 'ALL') params.append('tag', tag);
      const res = await fetch(`/api/announcements?${params.toString()}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    if (tag && tag !== 'ALL') {
      return db.announcements.filter(n => n.tag === tag);
    }
    return db.announcements;
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const newNotice: Announcement = {
      id: `ntc-${Date.now()}`,
      title: data.title || 'Campus Announcement',
      dept: data.dept || 'Academic Affairs',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tag: data.tag || 'Academic Notice',
      body: data.body || '',
      verified: true
    };
    db.announcements.unshift(newNotice);
    saveLocalDb(db);
    return newNotice;
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch {}

    const db = getLocalDb();
    db.announcements = db.announcements.filter(n => n.id !== id);
    saveLocalDb(db);
    return { success: true };
  },

  // Database Management / Studio API
  async getDatabaseOverview(): Promise<DatabaseOverview> {
    try {
      const res = await fetch('/api/database/overview');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    return {
      engine: 'StudentSphere Browser Client Storage',
      version: '2.4.0',
      fileSizeKB: '14.2',
      lastModified: new Date().toISOString(),
      tables: [
        {
          name: 'repository',
          label: 'Academic Repository Notes',
          count: db.repository.length,
          description: 'Lecture notes, past papers, syllabus guides and manuals with ratings and virus checks.',
          columns: ['id', 'title', 'code', 'subject', 'semester', 'type', 'upvotes', 'downloads', 'author', 'date']
        },
        {
          name: 'lost_found',
          label: 'Lost & Found Notices',
          count: db.lost_found.length,
          description: 'Tracked campus items with status workflow, location zones, and claims.',
          columns: ['id', 'title', 'category', 'zone', 'time', 'status', 'reporter', 'contact']
        },
        {
          name: 'announcements',
          label: 'Campus Announcements Feed',
          count: db.announcements.length,
          description: 'Verified department circulars, exam notifications, and campus events.',
          columns: ['id', 'title', 'dept', 'date', 'tag', 'verified', 'body']
        },
        {
          name: 'users',
          label: 'Campus Community Users',
          count: db.users.length,
          description: 'Registered students, faculty members, and campus platform administrators.',
          columns: ['id', 'name', 'email', 'role', 'department', 'studentId', 'createdAt']
        },
        {
          name: 'activity_logs',
          label: 'Database Audit Logs',
          count: db.activity_logs.length,
          description: 'System actions, entity modifications, and operation histories.',
          columns: ['id', 'action', 'entity', 'details', 'timestamp']
        }
      ]
    };
  },

  async getDatabaseTable(tableName: string): Promise<{ tableName: string; records: any[] }> {
    try {
      const res = await fetch(`/api/database/table/${tableName}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    return {
      tableName,
      records: (db as any)[tableName] || []
    };
  },

  async insertDatabaseRecord(tableName: string, record: any): Promise<{ success: boolean; record: any }> {
    try {
      const res = await fetch(`/api/database/table/${tableName}/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    if (!record.id) record.id = `${tableName.substring(0, 3)}-${Date.now()}`;
    if ((db as any)[tableName]) {
      (db as any)[tableName].unshift(record);
      saveLocalDb(db);
    }
    return { success: true, record };
  },

  async updateDatabaseRecord(tableName: string, id: string, record: any): Promise<{ success: boolean; record: any }> {
    try {
      const res = await fetch(`/api/database/table/${tableName}/record/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch {}

    const db = getLocalDb();
    const list = (db as any)[tableName] as any[];
    if (list) {
      const idx = list.findIndex(r => r.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...record };
        saveLocalDb(db);
        return { success: true, record: list[idx] };
      }
    }
    throw new Error('Record not found');
  },

  async deleteDatabaseRecord(tableName: string, id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/database/table/${tableName}/record/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return await res.json();
    } catch {}

    const db = getLocalDb();
    if ((db as any)[tableName]) {
      (db as any)[tableName] = (db as any)[tableName].filter((r: any) => r.id !== id);
      saveLocalDb(db);
      return { success: true };
    }
    throw new Error('Table not found');
  },

  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/database/reset', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {}

    const fresh = JSON.parse(JSON.stringify(fallbackSeedData));
    saveLocalDb(fresh);
    return { success: true, message: 'Database reset to default seed records.' };
  },

  async importDatabase(jsonData: any): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/database/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });
      if (res.ok) return await res.json();
    } catch {}

    saveLocalDb(jsonData);
    return { success: true, message: 'Database updated from imported file.' };
  },

  exportDatabaseUrl(): string {
    return '/api/database/export';
  }
};
