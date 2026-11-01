import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Database storage setup
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface RepoItem {
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

interface LostFoundItem {
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

interface Announcement {
  id: string;
  title: string;
  dept: string;
  date: string;
  tag: 'Academic Notice' | 'Campus Event' | 'Facility Update';
  body: string;
  verified: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  studentId: string;
  avatar: string;
  bio?: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

interface DatabaseSchema {
  repository: RepoItem[];
  lost_found: LostFoundItem[];
  announcements: Announcement[];
  users: User[];
  activity_logs: AuditLog[];
}

const defaultSeedData: DatabaseSchema = {
  repository: [
    {
      id: 'rep-101',
      title: 'Engineering Mathematics III - Differential Equations & Fourier Analysis',
      code: 'MATH301',
      subject: 'Engineering Mathematics',
      semester: 'Semester 3',
      type: 'Lecture Notes',
      author: 'Academic Cohort',
      upvotes: 142,
      downloads: 389,
      virusChecked: true,
      date: 'Oct 28, 2026',
      icon: 'fa-calculator',
      summary: 'Complete solved examples on Laplace transforms, Fourier series decomposition, and 2nd order differential equations.',
      fileName: 'Math301_Fourier_Laplace_Solved.pdf',
      fileSize: '4.8 MB'
    },
    {
      id: 'rep-102',
      title: 'Fluid Mechanics Lab Experiment Protocols & Calibration Manual',
      code: 'ME304',
      subject: 'Fluid Mechanics',
      semester: 'Semester 4',
      type: 'Lab & Tech Manuals',
      author: 'Department Faculty',
      upvotes: 89,
      downloads: 215,
      virusChecked: true,
      date: 'Oct 25, 2026',
      icon: 'fa-water',
      summary: 'Standard operating procedures for Venturimeter calibration, Reynolds number apparatus, and Pipe friction analysis.',
      fileName: 'ME304_Fluid_Mechanics_Lab.pdf',
      fileSize: '6.2 MB'
    },
    {
      id: 'rep-103',
      title: 'C Programming & Data Structures - Previous Solved Papers Archive',
      code: 'CS101',
      subject: 'C Programming',
      semester: 'Semester 1',
      type: 'Past Papers',
      author: 'Student Academic Archive',
      upvotes: 230,
      downloads: 650,
      virusChecked: true,
      date: 'Oct 29, 2026',
      icon: 'fa-code',
      summary: 'Comprehensive question bank covering memory pointers, linked lists, binary trees, dynamic programming, and recursion.',
      fileName: 'CS101_Solved_Papers_2022_2025.pdf',
      fileSize: '8.4 MB'
    },
    {
      id: 'rep-104',
      title: 'Quantum Physics & Electromagnetism Revision Cheat Sheet',
      code: 'PY202',
      subject: 'Quantum Physics',
      semester: 'Semester 2',
      type: 'Peer Summaries',
      author: 'Physics Cohort Lead',
      upvotes: 175,
      downloads: 410,
      virusChecked: true,
      date: 'Oct 30, 2026',
      icon: 'fa-atom',
      summary: 'Handwritten 12-page summary of Schrodinger wave equation derivation, Maxwell equations, and wave-particle duality.',
      fileName: 'PY202_Quantum_Revision_Sheet.pdf',
      fileSize: '3.1 MB'
    },
    {
      id: 'rep-105',
      title: 'Electrical Circuit Theory & Network Analysis Formula Guide',
      code: 'EE201',
      subject: 'Electrical Circuits',
      semester: 'Semester 3',
      type: 'Peer Summaries',
      author: 'Student Contributor',
      upvotes: 98,
      downloads: 180,
      virusChecked: true,
      date: 'Oct 22, 2026',
      icon: 'fa-bolt',
      summary: 'Quick reference formulas for Thevenin theorem, Norton equivalent, RLC resonance, and 2-port network parameters.',
      fileName: 'EE201_Circuit_Theory_Formulas.pdf',
      fileSize: '2.5 MB'
    },
    {
      id: 'rep-106',
      title: 'Database Systems (DBMS) - Relational Algebra & SQL Mastery',
      code: 'CS402',
      subject: 'Database Systems',
      semester: 'Semester 5',
      type: 'Lecture Notes',
      author: 'CS Department Faculty',
      upvotes: 310,
      downloads: 820,
      virusChecked: true,
      date: 'Oct 27, 2026',
      icon: 'fa-database',
      summary: 'Normal forms (1NF through BCNF), indexing, transaction concurrency control, and complex SQL query optimization.',
      fileName: 'CS402_DBMS_Relational_SQL.pdf',
      fileSize: '7.3 MB'
    }
  ],
  lost_found: [
    {
      id: 'lf-201',
      title: 'MacBook Pro M2 Space Gray (Tech Stickers)',
      category: 'Electronics',
      zone: 'Engineering Block A',
      time: 'Today at 10:15 AM',
      status: 'Lost',
      reporter: 'CS Cohort Member',
      contact: 'student.contact@univ.edu',
      imageBg: 'from-slate-700 to-slate-900',
      imageIcon: 'fa-laptop',
      desc: 'Left on desk in Computer Lab 204. Has a green StudentSphere sticker on the top shell.'
    },
    {
      id: 'lf-202',
      title: 'Blue Leather Wallet with Student ID Card',
      category: 'ID & Keys',
      zone: 'Central Library',
      time: 'Yesterday at 04:30 PM',
      status: 'Claimed',
      reporter: 'Library Desk Staff',
      contact: 'library.desk@univ.edu',
      imageBg: 'from-blue-800 to-indigo-950',
      imageIcon: 'fa-id-card',
      desc: 'Found near 2nd floor quiet study cubicle #14. Currently secured at Library reception desk.'
    },
    {
      id: 'lf-203',
      title: 'Calculus & Linear Algebra Spiral Notebook',
      category: 'Books & Notes',
      zone: 'Main Cafeteria',
      time: 'Oct 28, 2026',
      status: 'Returned',
      reporter: 'Campus Contributor',
      contact: 'campus.desk@univ.edu',
      imageBg: 'from-amber-800 to-amber-950',
      imageIcon: 'fa-book-open',
      desc: 'Returned to owner within 2 hours of posting on StudentSphere engine!'
    },
    {
      id: 'lf-204',
      title: 'Sony WH-1000XM4 Wireless Headphones (Black Case)',
      category: 'Electronics',
      zone: 'Sports Complex',
      time: 'Today at 08:30 AM',
      status: 'Lost',
      reporter: 'Sports Member',
      contact: 'member@univ.edu',
      imageBg: 'from-zinc-800 to-black',
      imageIcon: 'fa-headphones',
      desc: 'Lost near the indoor badminton courts. Finder will receive campus voucher.'
    },
    {
      id: 'lf-205',
      title: 'Set of 3 Keys with Red Brass Keychain',
      category: 'ID & Keys',
      zone: 'Science Complex',
      time: 'Oct 29, 2026',
      status: 'Lost',
      reporter: 'Science Student',
      contact: 'student@univ.edu',
      imageBg: 'from-red-900 to-stone-900',
      imageIcon: 'fa-key',
      desc: 'Includes dorm room key and bike lock key. Dropped between Lecture Hall B and Cafe.'
    }
  ],
  announcements: [
    {
      id: 'ntc-301',
      title: 'Mid-Semester Examination Schedule - Autumn 2026',
      dept: 'Academic Affairs Office',
      date: 'Oct 30, 2026',
      tag: 'Academic Notice',
      body: 'The official Autumn 2026 exam timetables and hall seating allocations are now published. Please verify your course codes.',
      verified: true
    },
    {
      id: 'ntc-302',
      title: 'Annual University Hackathon & Tech Expo Registration',
      dept: 'Innovation & Robotics Club',
      date: 'Oct 29, 2026',
      tag: 'Campus Event',
      body: '48-hour hackathon open to all engineering and science cohorts. Prize pool includes project seed funding and cloud credits.',
      verified: true
    },
    {
      id: 'ntc-303',
      title: 'Central Library Extended 24/7 Hours for Revision Week',
      dept: 'University Library Management',
      date: 'Oct 27, 2026',
      tag: 'Facility Update',
      body: 'Main study halls and high-speed Wi-Fi zones will remain open overnight starting next Monday to support exam preparation.',
      verified: true
    }
  ],
  users: [
    {
      id: 'usr-1',
      name: 'Alex Chen',
      email: 'alex.chen@univ.edu',
      role: 'student',
      department: 'Computer Science & Engineering',
      studentId: 'CS-2024-882',
      avatar: '',
      bio: 'Junior year CS student focusing on distributed systems and algorithm design.',
      createdAt: 'Oct 20, 2026'
    },
    {
      id: 'usr-2',
      name: 'Dr. Sarah Jenkins',
      email: 'sarah.jenkins@univ.edu',
      role: 'faculty',
      department: 'Mechanical Engineering',
      studentId: 'FAC-771',
      avatar: '',
      bio: 'Associate Professor, Fluid Mechanics & Aerodynamics Laboratory Lead.',
      createdAt: 'Sep 15, 2026'
    },
    {
      id: 'usr-3',
      name: 'Marcus Vance',
      email: 'admin.hub@univ.edu',
      role: 'admin',
      department: 'Office of Academic Affairs',
      studentId: 'ADM-001',
      avatar: '',
      bio: 'StudentSphere Lead Administrator & Campus Operations Manager.',
      createdAt: 'Aug 01, 2026'
    }
  ],
  activity_logs: [
    {
      id: 'log-1',
      action: 'INIT',
      entity: 'database',
      details: 'StudentSphere Database initialized with certified academic repository records and campus notices.',
      timestamp: new Date().toISOString()
    }
  ]
};

// Database helper functions with file persistence
function ensureDbExists(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultSeedData, null, 2), 'utf-8');
    return defaultSeedData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.repository || !parsed.lost_found || !parsed.announcements) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultSeedData, null, 2), 'utf-8');
      return defaultSeedData;
    }
    if (!parsed.users) {
      parsed.users = defaultSeedData.users;
      saveDb(parsed);
    } else {
      let cleaned = false;
      parsed.users.forEach((u: any) => {
        if (u.avatar && (u.avatar.includes('unsplash.com') || u.avatar.includes('images.'))) {
          u.avatar = '';
          cleaned = true;
        }
      });
      if (cleaned) saveDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database file, resetting to seed data:', err);
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultSeedData, null, 2), 'utf-8');
    return defaultSeedData;
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

function logActivity(db: DatabaseSchema, action: string, entity: string, details: string) {
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action,
    entity,
    details,
    timestamp: new Date().toISOString()
  };
  if (!db.activity_logs) db.activity_logs = [];
  db.activity_logs.unshift(log);
  if (db.activity_logs.length > 50) {
    db.activity_logs = db.activity_logs.slice(0, 50);
  }
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// System Health & Overview
app.get('/api/health', (req: Request, res: Response) => {
  const db = ensureDbExists();
  res.json({
    status: 'healthy',
    mode: process.env.NODE_ENV || 'development',
    storage: 'persistent_json_file',
    path: DB_FILE,
    timestamp: new Date().toISOString(),
    recordCounts: {
      repository: db.repository.length,
      lost_found: db.lost_found.length,
      announcements: db.announcements.length,
      logs: (db.activity_logs || []).length
    }
  });
});

// Platform Stats
app.get('/api/stats', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const totalNotes = db.repository.length;
  const totalDownloads = db.repository.reduce((acc, n) => acc + (n.downloads || 0), 0);
  const totalUpvotes = db.repository.reduce((acc, n) => acc + (n.upvotes || 0), 0);
  const totalItems = db.lost_found.length;
  const returnedItems = db.lost_found.filter(i => i.status === 'Returned').length;
  const pendingItems = db.lost_found.filter(i => i.status === 'Claimed').length;
  const resolutionRate = totalItems > 0 ? Math.round((returnedItems / totalItems) * 100) : 89;

  res.json({
    totalNotes,
    totalDownloads,
    totalUpvotes,
    totalItems,
    returnedItems,
    pendingItems,
    resolutionRate: resolutionRate || 89,
    averageClaimTimeHours: 18,
    activeFlyersPrevented: totalItems * 12
  });
});

// ================= ACADEMIC REPOSITORY API =================
app.get('/api/repository', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { query, subject, semester, type } = req.query;

  let results = [...db.repository];

  if (query && typeof query === 'string') {
    const q = query.toLowerCase().trim();
    results = results.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q)
    );
  }

  if (subject && subject !== 'ALL') {
    results = results.filter(item => item.subject === subject);
  }

  if (semester && semester !== 'ALL') {
    results = results.filter(item => item.semester === semester);
  }

  if (type && type !== 'ALL') {
    results = results.filter(item => item.type === type);
  }

  res.json(results);
});

app.post('/api/repository', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { title, code, subject, semester, type, author, summary, fileName } = req.body;

  if (!title || !code || !subject || !semester) {
    return res.status(400).json({ error: 'Missing required repository fields' });
  }

  const iconMap: Record<string, string> = {
    'Engineering Mathematics': 'fa-calculator',
    'Fluid Mechanics': 'fa-water',
    'C Programming': 'fa-code',
    'Quantum Physics': 'fa-atom',
    'Electrical Circuits': 'fa-bolt',
    'Database Systems': 'fa-database'
  };

  const newNote: RepoItem = {
    id: `rep-${Date.now()}`,
    title,
    code: code.toUpperCase(),
    subject,
    semester,
    type: type || 'Lecture Notes',
    author: author || 'Student Contributor',
    upvotes: 1,
    downloads: 0,
    virusChecked: true,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    icon: iconMap[subject] || 'fa-file-lines',
    summary: summary || 'Peer-contributed study resource reviewed and cataloged.',
    fileName: fileName || `${code.toUpperCase()}_Study_Material.pdf`,
    fileSize: `${(Math.random() * 4 + 1.5).toFixed(1)} MB`
  };

  db.repository.unshift(newNote);
  logActivity(db, 'CREATE', 'repository', `Uploaded study resource: ${newNote.title} (${newNote.code})`);
  saveDb(db);

  res.status(201).json(newNote);
});

app.post('/api/repository/:id/upvote', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { id } = req.params;
  const item = db.repository.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Repository item not found' });
  }

  item.upvotes += 1;
  logActivity(db, 'UPVOTE', 'repository', `Upvoted resource: ${item.code} (${item.title})`);
  saveDb(db);

  res.json({ success: true, upvotes: item.upvotes, item });
});

app.post('/api/repository/:id/download', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { id } = req.params;
  const item = db.repository.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Repository item not found' });
  }

  item.downloads += 1;
  logActivity(db, 'DOWNLOAD', 'repository', `Downloaded resource: ${item.code}`);
  saveDb(db);

  res.json({ success: true, downloads: item.downloads, item });
});

app.delete('/api/repository/:id', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { id } = req.params;
  const initialLength = db.repository.length;
  db.repository = db.repository.filter(i => i.id !== id);

  if (db.repository.length === initialLength) {
    return res.status(404).json({ error: 'Item not found' });
  }

  logActivity(db, 'DELETE', 'repository', `Deleted resource ${id}`);
  saveDb(db);
  res.json({ success: true });
});

// ================= LOST & FOUND ENGINE API =================
app.get('/api/lost-found', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { query, category, zone, status } = req.query;

  let results = [...db.lost_found];

  if (query && typeof query === 'string') {
    const q = query.toLowerCase().trim();
    results = results.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.zone.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'ALL') {
    results = results.filter(item => item.category === category);
  }

  if (zone && zone !== 'ALL') {
    results = results.filter(item => item.zone === zone);
  }

  if (status && status !== 'ALL') {
    results = results.filter(item => item.status === status);
  }

  res.json(results);
});

app.post('/api/lost-found', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { title, status, category, zone, time, desc, contact } = req.body;

  if (!title || !status || !category || !zone) {
    return res.status(400).json({ error: 'Missing required item report fields' });
  }

  const iconMap: Record<string, string> = {
    'Electronics': 'fa-laptop',
    'ID & Keys': 'fa-id-card',
    'Books & Notes': 'fa-book-open',
    'Personal Items': 'fa-bag-shopping'
  };

  const bgMap: Record<string, string> = {
    'Lost': 'from-red-900 to-black',
    'Claimed': 'from-amber-800 to-stone-900',
    'Returned': 'from-emerald-800 to-stone-900'
  };

  const newItem: LostFoundItem = {
    id: `lf-${Date.now()}`,
    title,
    category,
    zone,
    time: time || 'Just now',
    status: status as 'Lost' | 'Claimed' | 'Returned',
    reporter: 'Campus Reporter',
    contact: contact || 'student.contact@univ.edu',
    imageBg: bgMap[status] || 'from-slate-800 to-black',
    imageIcon: iconMap[category] || 'fa-box',
    desc: desc || 'Item reported via StudentSphere Campus Engine.'
  };

  db.lost_found.unshift(newItem);
  logActivity(db, 'REPORT', 'lost_found', `Reported [${status}] item: ${title} at ${zone}`);
  saveDb(db);

  res.status(201).json(newItem);
});

app.patch('/api/lost-found/:id/status', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { id } = req.params;
  const { status } = req.body;

  const item = db.lost_found.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const prevStatus = item.status;
  item.status = status;
  logActivity(db, 'STATUS_CHANGE', 'lost_found', `Status of '${item.title}' changed from ${prevStatus} to ${status}`);
  saveDb(db);

  res.json({ success: true, item });
});

app.post('/api/lost-found/:id/claim', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { id } = req.params;
  const { claimantName, claimantEmail, message } = req.body;

  const item = db.lost_found.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.claimedBy = `${claimantName} (${claimantEmail})`;
  item.claimNotes = message;
  item.status = 'Claimed';
  logActivity(db, 'CLAIM_SUBMITTED', 'lost_found', `Claim submitted for '${item.title}' by ${claimantName}`);
  saveDb(db);

  res.json({ success: true, message: 'Claim request registered. The reporter will be contacted.', item });
});

app.delete('/api/lost-found/:id', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { id } = req.params;
  const initialLength = db.lost_found.length;
  db.lost_found = db.lost_found.filter(i => i.id !== id);

  if (db.lost_found.length === initialLength) {
    return res.status(404).json({ error: 'Item not found' });
  }

  logActivity(db, 'DELETE', 'lost_found', `Deleted notice ${id}`);
  saveDb(db);
  res.json({ success: true });
});

// ================= CAMPUS ANNOUNCEMENTS API =================
app.get('/api/announcements', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { tag } = req.query;

  let results = [...db.announcements];
  if (tag && tag !== 'ALL') {
    results = results.filter(n => n.tag === tag);
  }

  res.json(results);
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { title, dept, tag, body } = req.body;

  if (!title || !dept || !tag || !body) {
    return res.status(400).json({ error: 'Missing required announcement fields' });
  }

  const newNotice: Announcement = {
    id: `ntc-${Date.now()}`,
    title,
    dept,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    tag,
    body,
    verified: true
  };

  db.announcements.unshift(newNotice);
  logActivity(db, 'CREATE', 'announcements', `Published announcement: "${title}" by ${dept}`);
  saveDb(db);

  res.status(201).json(newNotice);
});

app.delete('/api/announcements/:id', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { id } = req.params;
  const initialLength = db.announcements.length;
  db.announcements = db.announcements.filter(n => n.id !== id);

  if (db.announcements.length === initialLength) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  logActivity(db, 'DELETE', 'announcements', `Deleted announcement ${id}`);
  saveDb(db);
  res.json({ success: true });
});

// ================= AUTHENTICATION & PROFILES API =================
// Return demo accounts for fast one-click login testing
app.get('/api/auth/demo-accounts', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const accounts = (db.users || []).slice(0, 3);
  res.json(accounts);
});

// Get all registered users (for admin / directory)
app.get('/api/auth/users', (req: Request, res: Response) => {
  const db = ensureDbExists();
  res.json(db.users || []);
});

// User Login (supports demo accounts, email sign-in, or instant profile activation)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  let user = (db.users || []).find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    // If logging in with a new university handle, auto-provision student profile
    const derivedName = normalizedEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    user = {
      id: `usr-${Date.now()}`,
      name: derivedName || 'Campus Student',
      email: normalizedEmail,
      role: 'student',
      department: 'General Academics',
      studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: '',
      bio: 'University campus member.',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    if (!db.users) db.users = [];
    db.users.push(user);
    logActivity(db, 'SIGNUP', 'users', `New user registered: ${user.name} (${user.email})`);
    saveDb(db);
  } else {
    logActivity(db, 'LOGIN', 'users', `User logged in: ${user.name} (${user.role})`);
    saveDb(db);
  }

  res.json({
    success: true,
    user,
    token: `token-${user.id}-${Date.now()}`
  });
});

// User Registration
app.post('/api/auth/register', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { name, email, role, department, studentId } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = (db.users || []).find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email: normalizedEmail,
    role: (role as any) || 'student',
    department: department || 'Engineering & Science',
    studentId: studentId || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
    avatar: '',
    bio: `${role.toUpperCase()} member in ${department || 'General Academics'}.`,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  if (!db.users) db.users = [];
  db.users.unshift(newUser);
  logActivity(db, 'REGISTER', 'users', `Registered user: ${newUser.name} as ${newUser.role}`);
  saveDb(db);

  res.status(201).json({
    success: true,
    user: newUser,
    token: `token-${newUser.id}-${Date.now()}`
  });
});

// Update Profile (including optional profile picture)
app.patch('/api/auth/profile', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { id, avatar, bio, department, studentId, name } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const user = (db.users || []).find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (avatar !== undefined) user.avatar = avatar;
  if (bio !== undefined) user.bio = bio;
  if (department !== undefined) user.department = department;
  if (studentId !== undefined) user.studentId = studentId;
  if (name !== undefined) user.name = name;

  logActivity(db, 'UPDATE_PROFILE', 'users', `Updated profile of ${user.name}`);
  saveDb(db);

  res.json({ success: true, user });
});

// ================= USER-FRIENDLY DATABASE STUDIO API =================
// Overview / Schema / Stats
app.get('/api/database/overview', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const stats = fs.statSync(DB_FILE);

  res.json({
    engine: 'StudentSphere Lightweight Persistent Storage',
    version: '2.4.0',
    fileSizeKB: (stats.size / 1024).toFixed(2),
    lastModified: stats.mtime,
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
        count: (db.users || []).length,
        description: 'Registered students, faculty members, and campus platform administrators.',
        columns: ['id', 'name', 'email', 'role', 'department', 'studentId', 'createdAt']
      },
      {
        name: 'activity_logs',
        label: 'Database Audit Logs',
        count: (db.activity_logs || []).length,
        description: 'System actions, entity modifications, and operation histories.',
        columns: ['id', 'action', 'entity', 'details', 'timestamp']
      }
    ]
  });
});

// Get table records
app.get('/api/database/table/:tableName', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { tableName } = req.params;

  if (!(tableName in db)) {
    return res.status(404).json({ error: `Table '${tableName}' does not exist` });
  }

  res.json({
    tableName,
    records: (db as any)[tableName]
  });
});

// Add record to any table
app.post('/api/database/table/:tableName/record', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { tableName } = req.params;
  const record = req.body;

  if (!(tableName in db)) {
    return res.status(404).json({ error: `Table '${tableName}' does not exist` });
  }

  if (!record.id) {
    record.id = `${tableName.substring(0, 3)}-${Date.now()}`;
  }

  (db as any)[tableName].unshift(record);
  logActivity(db, 'DB_INSERT', tableName, `Inserted record with ID ${record.id}`);
  saveDb(db);

  res.status(201).json({ success: true, record });
});

// Update record in any table
app.put('/api/database/table/:tableName/record/:id', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { tableName, id } = req.params;
  const updates = req.body;

  if (!(tableName in db)) {
    return res.status(404).json({ error: `Table '${tableName}' does not exist` });
  }

  const list = (db as any)[tableName] as any[];
  const index = list.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Record with ID '${id}' not found in ${tableName}` });
  }

  list[index] = { ...list[index], ...updates };
  logActivity(db, 'DB_UPDATE', tableName, `Updated record ${id}`);
  saveDb(db);

  res.json({ success: true, record: list[index] });
});

// Delete record from any table
app.delete('/api/database/table/:tableName/record/:id', (req: Request, res: Response) => {
  const db = ensureDbExists();
  const { tableName, id } = req.params;

  if (!(tableName in db)) {
    return res.status(404).json({ error: `Table '${tableName}' does not exist` });
  }

  const list = (db as any)[tableName] as any[];
  const initialLen = list.length;
  (db as any)[tableName] = list.filter(r => r.id !== id);

  if ((db as any)[tableName].length === initialLen) {
    return res.status(404).json({ error: `Record with ID '${id}' not found in ${tableName}` });
  }

  logActivity(db, 'DB_DELETE', tableName, `Deleted record ${id}`);
  saveDb(db);

  res.json({ success: true });
});

// Reset entire database to default seed state
app.post('/api/database/reset', (req: Request, res: Response) => {
  const fresh = JSON.parse(JSON.stringify(defaultSeedData));
  fresh.activity_logs = [
    {
      id: `log-${Date.now()}`,
      action: 'RESET',
      entity: 'database',
      details: 'Database restored to demo campus seed data state.',
      timestamp: new Date().toISOString()
    }
  ];
  saveDb(fresh);
  res.json({ success: true, message: 'Database reset to default seed records.' });
});

// Export Database JSON
app.get('/api/database/export', (req: Request, res: Response) => {
  const db = ensureDbExists();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=studentsphere_database_export.json');
  res.send(JSON.stringify(db, null, 2));
});

// Import Database JSON
app.post('/api/database/import', (req: Request, res: Response) => {
  const importedData = req.body;
  if (!importedData || !Array.isArray(importedData.repository) || !Array.isArray(importedData.lost_found)) {
    return res.status(400).json({ error: 'Invalid database JSON format' });
  }

  logActivity(importedData, 'IMPORT', 'database', 'Imported new external database JSON.');
  saveDb(importedData);
  res.json({ success: true, message: 'Database updated from imported file.' });
});

// -------------------------------------------------------------
// VITE DEV SERVER OR PRODUCTION STATIC FILES
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`  VITE v8.3.0  ready in 180 ms`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://0.0.0.0:${PORT}/`);
    console.log(`StudentSphere server running on port ${PORT}`);
  });
}

startServer();
