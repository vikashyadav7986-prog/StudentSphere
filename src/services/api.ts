import { RepoItem, LostFoundItem, Announcement, DatabaseOverview, PlatformStats, User } from '../types';

export const api = {
  // Authentication & Users
  async getDemoAccounts(): Promise<User[]> {
    const res = await fetch('/api/auth/demo-accounts');
    return res.json();
  },

  async login(email: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async register(data: Partial<User>): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/auth/users');
    return res.json();
  },

  async updateProfile(data: { id: string; avatar?: string; bio?: string; department?: string; studentId?: string; name?: string }): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Platform & Health
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getStats(): Promise<PlatformStats> {
    const res = await fetch('/api/stats');
    return res.json();
  },

  // Academic Repository
  async getRepository(filters?: { query?: string; subject?: string; semester?: string; type?: string }): Promise<RepoItem[]> {
    const params = new URLSearchParams();
    if (filters?.query) params.append('query', filters.query);
    if (filters?.subject && filters.subject !== 'ALL') params.append('subject', filters.subject);
    if (filters?.semester && filters.semester !== 'ALL') params.append('semester', filters.semester);
    if (filters?.type && filters.type !== 'ALL') params.append('type', filters.type);

    const res = await fetch(`/api/repository?${params.toString()}`);
    return res.json();
  },

  async createRepositoryNote(data: Partial<RepoItem>): Promise<RepoItem> {
    const res = await fetch('/api/repository', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async upvoteNote(id: string): Promise<{ success: boolean; upvotes: number; item: RepoItem }> {
    const res = await fetch(`/api/repository/${id}/upvote`, { method: 'POST' });
    return res.json();
  },

  async downloadNote(id: string): Promise<{ success: boolean; downloads: number; item: RepoItem }> {
    const res = await fetch(`/api/repository/${id}/download`, { method: 'POST' });
    return res.json();
  },

  async deleteRepositoryNote(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/repository/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Lost & Found
  async getLostFound(filters?: { query?: string; category?: string; zone?: string; status?: string }): Promise<LostFoundItem[]> {
    const params = new URLSearchParams();
    if (filters?.query) params.append('query', filters.query);
    if (filters?.category && filters.category !== 'ALL') params.append('category', filters.category);
    if (filters?.zone && filters.zone !== 'ALL') params.append('zone', filters.zone);
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);

    const res = await fetch(`/api/lost-found?${params.toString()}`);
    return res.json();
  },

  async reportItem(data: Partial<LostFoundItem>): Promise<LostFoundItem> {
    const res = await fetch('/api/lost-found', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateItemStatus(id: string, status: 'Lost' | 'Claimed' | 'Returned'): Promise<{ success: boolean; item: LostFoundItem }> {
    const res = await fetch(`/api/lost-found/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async submitClaim(id: string, claimData: { claimantName: string; claimantEmail: string; message: string }) {
    const res = await fetch(`/api/lost-found/${id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData),
    });
    return res.json();
  },

  async deleteLostFoundItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/lost-found/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Announcements
  async getAnnouncements(tag?: string): Promise<Announcement[]> {
    const params = new URLSearchParams();
    if (tag && tag !== 'ALL') params.append('tag', tag);
    const res = await fetch(`/api/announcements?${params.toString()}`);
    return res.json();
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Database Management / Studio API
  async getDatabaseOverview(): Promise<DatabaseOverview> {
    const res = await fetch('/api/database/overview');
    return res.json();
  },

  async getDatabaseTable(tableName: string): Promise<{ tableName: string; records: any[] }> {
    const res = await fetch(`/api/database/table/${tableName}`);
    return res.json();
  },

  async insertDatabaseRecord(tableName: string, record: any): Promise<{ success: boolean; record: any }> {
    const res = await fetch(`/api/database/table/${tableName}/record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },

  async updateDatabaseRecord(tableName: string, id: string, record: any): Promise<{ success: boolean; record: any }> {
    const res = await fetch(`/api/database/table/${tableName}/record/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },

  async deleteDatabaseRecord(tableName: string, id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/database/table/${tableName}/record/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/database/reset', { method: 'POST' });
    return res.json();
  },

  async importDatabase(jsonData: any): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/database/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonData),
    });
    return res.json();
  },

  exportDatabaseUrl(): string {
    return '/api/database/export';
  }
};
