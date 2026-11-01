export type ViewType = 'home' | 'repository' | 'lostfound' | 'announcements' | 'database';

export interface RepoItem {
  id: string;
  title: string;
  code: string;
  subject: string;
  semester: string;
  type: string;
  author: string;
  upvotes: number;
  downloads: number;
  virusChecked: boolean;
  date: string;
  icon: string;
  summary: string;
  fileName?: string;
  fileSize?: string;
}

export interface LostFoundItem {
  id: string;
  title: string;
  category: string;
  zone: string;
  time: string;
  status: 'Lost' | 'Claimed' | 'Returned';
  reporter: string;
  contact: string;
  imageBg: string;
  imageIcon: string;
  desc: string;
  claimNotes?: string;
  claimedBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  dept: string;
  date: string;
  tag: 'Academic Notice' | 'Campus Event' | 'Facility Update';
  body: string;
  verified: boolean;
}

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentId: string;
  avatar: string;
  bio?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

export interface TableMeta {
  name: string;
  label: string;
  count: number;
  description: string;
  columns: string[];
}

export interface DatabaseOverview {
  engine: string;
  version: string;
  fileSizeKB: string;
  lastModified: string;
  tables: TableMeta[];
}

export interface PlatformStats {
  totalNotes: number;
  totalDownloads: number;
  totalUpvotes: number;
  totalItems: number;
  returnedItems: number;
  pendingItems: number;
  resolutionRate: number;
  averageClaimTimeHours: number;
  activeFlyersPrevented: number;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}
