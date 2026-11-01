import { RepoItem, LostFoundItem, Announcement, User, AuditLog } from '../types';

export interface FallbackDatabase {
  repository: RepoItem[];
  lost_found: LostFoundItem[];
  announcements: Announcement[];
  users: User[];
  activity_logs: AuditLog[];
}

export const fallbackSeedData: FallbackDatabase = {
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
