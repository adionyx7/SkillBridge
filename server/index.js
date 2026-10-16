import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Load environment variables from .env
dotenv.config();

// Optional Supabase admin client for server-side operations
let supabaseAdmin = null;
if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
  supabaseAdmin = createSupabaseClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('Supabase admin client configured on server.');
} else {
  console.log('Supabase admin client not configured. Set SUPABASE_SERVICE_ROLE_KEY in .env to enable it.');
}

app.use(cors());
app.use(express.json());

// Desktop Database Path
const DESKTOP_DB_DIR = 'C:\\Users\\ADITYA\\OneDrive\\Desktop\\Website_Database';
if (!fs.existsSync(DESKTOP_DB_DIR)) {
  fs.mkdirSync(DESKTOP_DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DESKTOP_DB_DIR, 'website_database.sqlite');
console.log(`Connecting to SQLite database at: ${DB_PATH}`);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database successfully!');
    initDatabase();
  }
});

// Helper for promise-based db runs
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function initDatabase() {
  try {
    // 1. Users Table (role is locked permanently upon account creation)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'company', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Students Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        college TEXT,
        degree TEXT,
        branch TEXT,
        year TEXT,
        location TEXT,
        skills TEXT,
        enrolled_courses TEXT,
        completed_courses TEXT,
        quiz_scores TEXT,
        bio TEXT,
        github_url TEXT,
        linkedin_url TEXT
      )
    `);

    // 3. Companies Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        company_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        website TEXT,
        industry TEXT,
        location TEXT,
        description TEXT,
        is_verified INTEGER DEFAULT 0,
        logo TEXT
      )
    `);

    // 4. Internships Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS internships (
        id TEXT PRIMARY KEY,
        company_id TEXT,
        company_name TEXT,
        company_logo TEXT,
        position TEXT,
        required_skills TEXT,
        location TEXT,
        work_mode TEXT,
        duration TEXT,
        stipend TEXT,
        posted_date TEXT,
        description TEXT,
        eligibility_requirements TEXT,
        applicants_count INTEGER DEFAULT 0
      )
    `);

    // 5. Applications Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        internship_id TEXT,
        student_id TEXT,
        student_name TEXT,
        student_email TEXT,
        student_college TEXT,
        student_branch TEXT,
        student_year TEXT,
        applied_date TEXT,
        status TEXT,
        match_percentage INTEGER,
        matching_skills TEXT,
        missing_skills TEXT,
        student_skill_scores TEXT
      )
    `);

    // 6. Posts Table (Experience & Certificate Showcase Feed)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        author_id TEXT,
        author_name TEXT NOT NULL,
        author_role TEXT,
        author_college TEXT,
        author_branch TEXT,
        author_avatar TEXT,
        bio_headline TEXT,
        content TEXT NOT NULL,
        post_type TEXT DEFAULT 'experience',
        certificates TEXT,
        images TEXT,
        tags TEXT,
        likes_count INTEGER DEFAULT 0,
        liked_by TEXT,
        comments TEXT,
        created_at TEXT
      )
    `);

    console.log('Database tables initialized.');
    await seedInitialData();
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
}

async function seedInitialData() {
  const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
  if (userCount && userCount.count > 0) {
    console.log('Database already contains seed data.');
    return;
  }

  console.log('Seeding initial database content...');

  // Initial Students
  const initialStudents = [
    {
      id: 'std_1',
      name: 'Alex Morgan',
      email: 'alex.student@example.com',
      password: 'password123',
      college: 'IIT Bombay',
      degree: 'B.Tech',
      branch: 'Computer Science',
      year: '3rd Year',
      location: 'Mumbai, India',
      skills: JSON.stringify({
        'Python': 82,
        'JavaScript': 75,
        'SQL': 80,
        'React': 65,
        'Node.js': 50,
        'Data Science': 40
      }),
      enrolled_courses: JSON.stringify(['course_1', 'course_3']),
      completed_courses: JSON.stringify(['course_4']),
      quiz_scores: JSON.stringify({ 'quiz_python': 85, 'quiz_sql': 80, 'quiz_js': 75 }),
      bio: 'Passionate developer focusing on scalable web applications and algorithmic data structures.',
      github_url: 'https://github.com/alexmorgan',
      linkedin_url: 'https://linkedin.com/in/alexmorgan'
    },
    {
      id: 'std_2',
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      password: 'password123',
      college: 'BITS Pilani',
      degree: 'B.E.',
      branch: 'Information Systems',
      year: '4th Year',
      location: 'Bengaluru, India',
      skills: JSON.stringify({
        'Python': 90,
        'Data Science': 88,
        'Machine Learning': 82,
        'SQL': 78
      }),
      enrolled_courses: JSON.stringify(['course_2']),
      completed_courses: JSON.stringify(['course_2']),
      quiz_scores: JSON.stringify({ 'quiz_python': 92, 'quiz_ds': 88 }),
      bio: 'Machine learning & data analytics researcher.',
      github_url: 'https://github.com/sophiachen',
      linkedin_url: 'https://linkedin.com/in/sophiachen'
    }
  ];

  for (const s of initialStudents) {
    await dbRun(
      `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
      [s.id, s.email, s.password, s.name, 'student']
    );
    await dbRun(
      `INSERT INTO students (id, user_id, name, email, college, degree, branch, year, location, skills, enrolled_courses, completed_courses, quiz_scores, bio, github_url, linkedin_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.id, s.name, s.email, s.college, s.degree, s.branch, s.year, s.location, s.skills, s.enrolled_courses, s.completed_courses, s.quiz_scores, s.bio, s.github_url, s.linkedin_url]
    );
  }

  // Initial Companies
  const initialCompanies = [
    {
      id: 'comp_1',
      company_name: 'TechCorp Innovations',
      email: 'recruiter@techcorp.com',
      password: 'password123',
      website: 'https://techcorp.example.com',
      industry: 'Software & AI Solutions',
      location: 'Bengaluru, India',
      description: 'Leading cloud-native software and AI product incubator empowering global enterprises.',
      is_verified: 1,
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'comp_2',
      company_name: 'DataPulse Analytics',
      email: 'careers@datapulse.ai',
      password: 'password123',
      website: 'https://datapulse.ai',
      industry: 'Big Data & Business Intelligence',
      location: 'Hyderabad, India',
      description: 'Next-gen analytics platform delivering predictive metrics and automated ML pipelines.',
      is_verified: 1,
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80'
    }
  ];

  for (const c of initialCompanies) {
    await dbRun(
      `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
      [c.id, c.email, c.password, c.company_name, 'company']
    );
    await dbRun(
      `INSERT INTO companies (id, user_id, company_name, email, website, industry, location, description, is_verified, logo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.id, c.company_name, c.email, c.website, c.industry, c.location, c.description, c.is_verified, c.logo]
    );
  }

  // Initial Admin User
  await dbRun(
    `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
    ['admin_1', 'admin@skillintern.com', 'adminsecretkey', 'Platform Administrator', 'admin']
  );

  // Initial Internships
  const initialInternships = [
    {
      id: 'intern_1',
      company_id: 'comp_1',
      company_name: 'TechCorp Innovations',
      company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80',
      position: 'Frontend React Engineering Intern',
      required_skills: JSON.stringify(['React', 'JavaScript', 'SQL']),
      location: 'Bengaluru, India',
      work_mode: 'Hybrid',
      duration: '6 Months',
      stipend: '₹35,000 / month',
      posted_date: '2 days ago',
      description: 'Join our dynamic web engine team to construct high-speed React dashboards with micro-frontend architectures.',
      eligibility_requirements: JSON.stringify(['Current B.Tech/B.E student (3rd or 4th year)', 'Minimum 70% verified score in React & JavaScript']),
      applicants_count: 14
    },
    {
      id: 'intern_2',
      company_id: 'comp_2',
      company_name: 'DataPulse Analytics',
      company_logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
      position: 'Data Science & ML Intern',
      required_skills: JSON.stringify(['Python', 'Data Science', 'SQL']),
      location: 'Hyderabad, India',
      work_mode: 'Remote',
      duration: '3 Months',
      stipend: '₹40,000 / month',
      posted_date: '1 day ago',
      description: 'Work alongside data scientists building customer churn prediction models and automated analytics dashboards.',
      eligibility_requirements: JSON.stringify(['Proficiency in Python and SQL', 'Background in CS, IT, or Statistics']),
      applicants_count: 22
    }
  ];

  for (const item of initialInternships) {
    await dbRun(
      `INSERT INTO internships (id, company_id, company_name, company_logo, position, required_skills, location, work_mode, duration, stipend, posted_date, description, eligibility_requirements, applicants_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.id, item.company_id, item.company_name, item.company_logo, item.position, item.required_skills, item.location, item.work_mode, item.duration, item.stipend, item.posted_date, item.description, item.eligibility_requirements, item.applicants_count]
    );
  }

  // Initial Applications
  const initialApplications = [
    {
      id: 'app_1',
      internship_id: 'intern_1',
      student_id: 'std_1',
      student_name: 'Alex Morgan',
      student_email: 'alex.student@example.com',
      student_college: 'IIT Bombay',
      student_branch: 'Computer Science',
      student_year: '3rd Year',
      applied_date: '2026-08-29',
      status: 'Shortlisted',
      match_percentage: 85,
      matching_skills: JSON.stringify(['Python', 'JavaScript', 'SQL']),
      missing_skills: JSON.stringify([]),
      student_skill_scores: JSON.stringify({ 'Python': 82, 'JavaScript': 75, 'SQL': 80, 'React': 65 })
    }
  ];

  for (const app of initialApplications) {
    await dbRun(
      `INSERT INTO applications (id, internship_id, student_id, student_name, student_email, student_college, student_branch, student_year, applied_date, status, match_percentage, matching_skills, missing_skills, student_skill_scores)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [app.id, app.internship_id, app.student_id, app.student_name, app.student_email, app.student_college, app.student_branch, app.student_year, app.applied_date, app.status, app.match_percentage, app.matching_skills, app.missing_skills, app.student_skill_scores]
    );
  }

  // Initial Posts (Experience & Certificate Showcase)
  const initialPosts = [
    {
      id: 'post_1',
      author_id: 'std_1',
      author_name: 'Alex Morgan',
      author_role: 'student',
      author_college: 'IIT Bombay',
      author_branch: 'Computer Science',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio_headline: '3rd Year CS Student @ IIT Bombay | Full-Stack Web Architecture Specialist',
      content: 'Extremely thrilled to share that I just completed the "Advanced React & Web Architecture" certification on SkillBridge! Spent 4 weeks building scalable micro-frontends and optimizing state management. Huge thanks to the SkillBridge ecosystem for the hands-on project verification!',
      post_type: 'certificate',
      certificates: JSON.stringify([{
        id: 'cert_101',
        title: 'Advanced React & Web Architecture',
        issuer: 'SkillBridge Ecosystem',
        date: 'Sept 2026',
        isVerified: true
      }]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
      ]),
      tags: JSON.stringify(['React', 'WebDev', 'Certificate', 'Frontend']),
      likes_count: 24,
      liked_by: JSON.stringify(['std_2', 'comp_1']),
      comments: JSON.stringify([
        {
          id: 'comm_1',
          authorName: 'Sophia Chen',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          text: 'Congratulations Alex! Super inspiring work on the React architecture projects.',
          createdAt: '2 hours ago'
        }
      ]),
      created_at: '1 day ago'
    },
    {
      id: 'post_2',
      author_id: 'std_2',
      author_name: 'Sophia Chen',
      author_role: 'student',
      author_college: 'BITS Pilani',
      author_branch: 'Information Systems',
      author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio_headline: 'Data Analytics & ML Researcher | BITS Pilani 4th Year',
      content: 'Wrapped up a fantastic data science project analyzing real-time predictive models using Python, Pandas, and SQL. Sharing a glance of our dataset insights and automated dashboard metrics!',
      post_type: 'experience',
      certificates: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
      ]),
      tags: JSON.stringify(['DataScience', 'Python', 'MachineLearning', 'InternshipExperience']),
      likes_count: 38,
      liked_by: JSON.stringify(['std_1']),
      comments: JSON.stringify([]),
      created_at: '2 days ago'
    }
  ];

  for (const post of initialPosts) {
    await dbRun(
      `INSERT INTO posts (id, author_id, author_name, author_role, author_college, author_branch, author_avatar, bio_headline, content, post_type, certificates, images, tags, likes_count, liked_by, comments, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [post.id, post.author_id, post.author_name, post.author_role, post.author_college, post.author_branch, post.author_avatar, post.bio_headline, post.content, post.post_type, post.certificates, post.images, post.tags, post.likes_count, post.liked_by, post.comments, post.created_at]
    );
  }

  console.log('Seed data successfully inserted into SQLite database!');
}

// REST API ROUTES

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbPath: DB_PATH });
});

// Example protected server route using Supabase admin client
app.get('/api/supabase/status', async (req, res) => {
  if (!supabaseAdmin) return res.status(501).json({ error: 'Supabase admin client not configured on server.' });
  try {
    const { data, error } = await supabaseAdmin.from('users').select('id', { count: 'exact', head: false }).limit(1);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, sample: data?.length ?? 0 });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// Fetch all database records for frontend context initialization
app.get('/api/data', async (req, res) => {
  try {
    const rawStudents = await dbAll('SELECT * FROM students');
    const rawCompanies = await dbAll('SELECT * FROM companies');
    const rawInternships = await dbAll('SELECT * FROM internships');
    const rawApplications = await dbAll('SELECT * FROM applications');
    const rawPosts = await dbAll('SELECT * FROM posts');

    const students = rawStudents.map(s => ({
      ...s,
      skills: JSON.parse(s.skills || '{}'),
      enrolledCourses: JSON.parse(s.enrolled_courses || '[]'),
      completedCourses: JSON.parse(s.completed_courses || '[]'),
      quizScores: JSON.parse(s.quiz_scores || '{}'),
      githubUrl: s.github_url,
      linkedinUrl: s.linkedin_url
    }));

    const companies = rawCompanies.map(c => ({
      id: c.id,
      companyName: c.company_name,
      email: c.email,
      website: c.website,
      industry: c.industry,
      location: c.location,
      description: c.description,
      isVerified: Boolean(c.is_verified),
      logo: c.logo
    }));

    const internships = rawInternships.map(i => ({
      id: i.id,
      companyId: i.company_id,
      companyName: i.company_name,
      companyLogo: i.company_logo,
      position: i.position,
      requiredSkills: JSON.parse(i.required_skills || '[]'),
      location: i.location,
      workMode: i.work_mode,
      duration: i.duration,
      stipend: i.stipend,
      postedDate: i.posted_date,
      description: i.description,
      eligibilityRequirements: JSON.parse(i.eligibility_requirements || '[]'),
      applicantsCount: i.applicants_count
    }));

    const applications = rawApplications.map(a => ({
      id: a.id,
      internshipId: a.internship_id,
      studentId: a.student_id,
      studentName: a.student_name,
      studentEmail: a.student_email,
      studentCollege: a.student_college,
      studentBranch: a.student_branch,
      studentYear: a.student_year,
      appliedDate: a.applied_date,
      status: a.status,
      matchPercentage: a.match_percentage,
      matchingSkills: JSON.parse(a.matching_skills || '[]'),
      missingSkills: JSON.parse(a.missing_skills || '[]'),
      studentSkillScores: JSON.parse(a.student_skill_scores || '{}')
    }));

    const posts = rawPosts.map(p => ({
      id: p.id,
      authorId: p.author_id,
      authorName: p.author_name,
      authorRole: p.author_role,
      authorCollege: p.author_college,
      authorBranch: p.author_branch,
      authorAvatar: p.author_avatar,
      bioHeadline: p.bio_headline,
      content: p.content,
      postType: p.post_type,
      certificates: JSON.parse(p.certificates || '[]'),
      images: JSON.parse(p.images || '[]'),
      tags: JSON.parse(p.tags || '[]'),
      likesCount: p.likes_count || 0,
      likedBy: JSON.parse(p.liked_by || '[]'),
      comments: JSON.parse(p.comments || '[]'),
      createdAt: p.created_at
    }));

    res.json({ students, companies, internships, applications, posts });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Authentication: Register
app.post('/api/auth/register', async (req, res) => {
  const { role, email, password, name, ...details } = req.body;

  if (!role || !['student', 'company'].includes(role)) {
    return res.status(400).json({ error: 'Invalid account type. Role must be student or company.' });
  }
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const existing = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists. Please login.' });
    }

    const userId = `${role === 'student' ? 'std' : 'comp'}_${Date.now()}`;
    await dbRun(
      'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      [userId, email.toLowerCase(), password, name || details.companyName || 'User', role]
    );

    if (role === 'student') {
      const defaultSkills = JSON.stringify({ 'Python': 60, 'JavaScript': 65, 'SQL': 55 });
      await dbRun(
        `INSERT INTO students (id, user_id, name, email, college, degree, branch, year, location, skills, enrolled_courses, completed_courses, quiz_scores, bio, github_url, linkedin_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          userId,
          name || 'Student',
          email.toLowerCase(),
          details.college || 'University',
          details.degree || 'B.Tech',
          details.branch || 'Computer Science',
          details.year || '3rd Year',
          details.location || 'India',
          defaultSkills,
          '[]',
          '[]',
          '{}',
          details.bio || '',
          details.githubUrl || '',
          details.linkedinUrl || ''
        ]
      );

      const student = await dbGet('SELECT * FROM students WHERE id = ?', [userId]);
      return res.json({
        success: true,
        user: { id: userId, email: student.email, name: student.name, role: 'student' },
        profile: {
          ...student,
          skills: JSON.parse(student.skills),
          enrolledCourses: [],
          completedCourses: [],
          quizScores: {}
        }
      });
    } else {
      await dbRun(
        `INSERT INTO companies (id, user_id, company_name, email, website, industry, location, description, is_verified, logo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          userId,
          details.companyName || name || 'Company',
          email.toLowerCase(),
          details.website || '',
          details.industry || 'Technology',
          details.location || 'India',
          details.description || '',
          0,
          details.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80'
        ]
      );

      const company = await dbGet('SELECT * FROM companies WHERE id = ?', [userId]);
      return res.json({
        success: true,
        user: { id: userId, email: company.email, name: company.company_name, role: 'company' },
        profile: {
          id: company.id,
          companyName: company.company_name,
          email: company.email,
          website: company.website,
          industry: company.industry,
          location: company.location,
          description: company.description,
          isVerified: false,
          logo: company.logo
        }
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register account' });
  }
});

function formatStudentProfile(student) {
  return {
    ...student,
    skills: JSON.parse(student.skills || '{}'),
    enrolledCourses: JSON.parse(student.enrolled_courses || '[]'),
    completedCourses: JSON.parse(student.completed_courses || '[]'),
    quizScores: JSON.parse(student.quiz_scores || '{}'),
    githubUrl: student.github_url,
    linkedinUrl: student.linkedin_url
  };
}

function formatCompanyProfile(company) {
  return {
    id: company.id,
    companyName: company.company_name,
    email: company.email,
    website: company.website,
    industry: company.industry,
    location: company.location,
    description: company.description,
    isVerified: Boolean(company.is_verified),
    logo: company.logo
  };
}

// Load app profile after a successful Supabase login
app.get('/api/auth/profile', async (req, res) => {
  const email = String(req.query.email || '').toLowerCase();
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    if (user.role === 'student') {
      const student = await dbGet('SELECT * FROM students WHERE email = ?', [user.email]);
      if (!student) {
        return res.status(404).json({ error: 'Student profile not found.' });
      }
      return res.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: 'student' },
        profile: formatStudentProfile(student)
      });
    }

    if (user.role === 'company') {
      const company = await dbGet('SELECT * FROM companies WHERE email = ?', [user.email]);
      if (!company) {
        return res.status(404).json({ error: 'Company profile not found.' });
      }
      return res.json({
        success: true,
        user: { id: user.id, email: user.email, name: company.company_name, role: 'company' },
        profile: formatCompanyProfile(company)
      });
    }

    return res.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: 'admin' }
    });
  } catch (err) {
    console.error('Profile lookup error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// Authentication: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(404).json({ error: 'User account not found. Please register first.' });
    }

    // ─── PASSWORD VERIFICATION ─────────────────────────────────────────────
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    if (role && user.role !== role && user.role !== 'admin') {
      return res.status(400).json({ error: `This account is registered as a ${user.role}. Please log in via the ${user.role} tab.` });
    }

    if (user.role === 'student') {
      const student = await dbGet('SELECT * FROM students WHERE email = ?', [user.email]);
      return res.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: 'student' },
        profile: {
          ...student,
          skills: JSON.parse(student.skills || '{}'),
          enrolledCourses: JSON.parse(student.enrolled_courses || '[]'),
          completedCourses: JSON.parse(student.completed_courses || '[]'),
          quizScores: JSON.parse(student.quiz_scores || '{}'),
          githubUrl: student.github_url,
          linkedinUrl: student.linkedin_url
        }
      });
    } else if (user.role === 'company') {
      const company = await dbGet('SELECT * FROM companies WHERE email = ?', [user.email]);
      return res.json({
        success: true,
        user: { id: user.id, email: user.email, name: company ? company.company_name : user.name, role: 'company' },
        profile: {
          id: company.id,
          companyName: company.company_name,
          email: company.email,
          website: company.website,
          industry: company.industry,
          location: company.location,
          description: company.description,
          isVerified: Boolean(company.is_verified),
          logo: company.logo
        }
      });
    } else if (user.role === 'admin') {
      return res.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: 'admin' }
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Update Student Profile (NOTE: Account Role/Type cannot be modified!)
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, college, degree, branch, year, location, bio, githubUrl, linkedinUrl, skills, enrolledCourses, completedCourses, quizScores } = req.body;

  try {
    const existing = await dbGet('SELECT * FROM students WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Role changes strictly barred
    if (req.body.role || req.body.type) {
      console.warn(`Blocked attempt to change role/type for student ${id}`);
    }

    await dbRun(
      `UPDATE students SET
        name = COALESCE(?, name),
        college = COALESCE(?, college),
        degree = COALESCE(?, degree),
        branch = COALESCE(?, branch),
        year = COALESCE(?, year),
        location = COALESCE(?, location),
        bio = COALESCE(?, bio),
        github_url = COALESCE(?, github_url),
        linkedin_url = COALESCE(?, linkedin_url),
        skills = COALESCE(?, skills),
        enrolled_courses = COALESCE(?, enrolled_courses),
        completed_courses = COALESCE(?, completed_courses),
        quiz_scores = COALESCE(?, quiz_scores)
       WHERE id = ?`,
      [
        name,
        college,
        degree,
        branch,
        year,
        location,
        bio,
        githubUrl,
        linkedinUrl,
        skills ? JSON.stringify(skills) : null,
        enrolledCourses ? JSON.stringify(enrolledCourses) : null,
        completedCourses ? JSON.stringify(completedCourses) : null,
        quizScores ? JSON.stringify(quizScores) : null,
        id
      ]
    );

    if (name) {
      await dbRun('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    }

    const updated = await dbGet('SELECT * FROM students WHERE id = ?', [id]);
    res.json({
      success: true,
      profile: {
        ...updated,
        skills: JSON.parse(updated.skills || '{}'),
        enrolledCourses: JSON.parse(updated.enrolled_courses || '[]'),
        completedCourses: JSON.parse(updated.completed_courses || '[]'),
        quizScores: JSON.parse(updated.quiz_scores || '{}'),
        githubUrl: updated.github_url,
        linkedinUrl: updated.linkedin_url
      }
    });
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Failed to update student profile' });
  }
});

// Update Company Profile (NOTE: Account Role/Type cannot be modified!)
app.put('/api/companies/:id', async (req, res) => {
  const { id } = req.params;
  const { companyName, website, industry, location, description, logo } = req.body;

  try {
    const existing = await dbGet('SELECT * FROM companies WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    // Role changes strictly barred
    if (req.body.role || req.body.type) {
      console.warn(`Blocked attempt to change role/type for company ${id}`);
    }

    await dbRun(
      `UPDATE companies SET
        company_name = COALESCE(?, company_name),
        website = COALESCE(?, website),
        industry = COALESCE(?, industry),
        location = COALESCE(?, location),
        description = COALESCE(?, description),
        logo = COALESCE(?, logo)
       WHERE id = ?`,
      [companyName, website, industry, location, description, logo, id]
    );

    if (companyName) {
      await dbRun('UPDATE users SET name = ? WHERE id = ?', [companyName, id]);
    }

    const updated = await dbGet('SELECT * FROM companies WHERE id = ?', [id]);
    res.json({
      success: true,
      profile: {
        id: updated.id,
        companyName: updated.company_name,
        email: updated.email,
        website: updated.website,
        industry: updated.industry,
        location: updated.location,
        description: updated.description,
        isVerified: Boolean(updated.is_verified),
        logo: updated.logo
      }
    });
  } catch (err) {
    console.error('Update company error:', err);
    res.status(500).json({ error: 'Failed to update company profile' });
  }
});

// Post New Internship
app.post('/api/internships', async (req, res) => {
  const { id, companyId, companyName, companyLogo, position, requiredSkills, location, workMode, duration, stipend, postedDate, description, eligibilityRequirements } = req.body;

  const newId = id || `intern_${Date.now()}`;
  try {
    await dbRun(
      `INSERT INTO internships (id, company_id, company_name, company_logo, position, required_skills, location, work_mode, duration, stipend, posted_date, description, eligibility_requirements, applicants_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        newId,
        companyId,
        companyName,
        companyLogo || '',
        position,
        JSON.stringify(requiredSkills || []),
        location,
        workMode || 'Remote',
        duration || '3 Months',
        stipend || 'Unpaid',
        postedDate || 'Just now',
        description || '',
        JSON.stringify(eligibilityRequirements || [])
      ]
    );

    res.json({
      success: true,
      internship: {
        id: newId,
        companyId,
        companyName,
        companyLogo,
        position,
        requiredSkills: requiredSkills || [],
        location,
        workMode: workMode || 'Remote',
        duration: duration || '3 Months',
        stipend: stipend || 'Unpaid',
        postedDate: postedDate || 'Just now',
        description: description || '',
        eligibilityRequirements: eligibilityRequirements || [],
        applicantsCount: 0
      }
    });
  } catch (err) {
    console.error('Post internship error:', err);
    res.status(500).json({ error: 'Failed to create internship' });
  }
});

// Apply for Internship
app.post('/api/applications', async (req, res) => {
  const appData = req.body;
  const appId = `app_${Date.now()}`;

  try {
    await dbRun(
      `INSERT INTO applications (id, internship_id, student_id, student_name, student_email, student_college, student_branch, student_year, applied_date, status, match_percentage, matching_skills, missing_skills, student_skill_scores)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appId,
        appData.internshipId,
        appData.studentId,
        appData.studentName,
        appData.studentEmail,
        appData.studentCollege,
        appData.studentBranch,
        appData.studentYear,
        appData.appliedDate || new Date().toISOString().split('T')[0],
        appData.status || 'Applied',
        appData.matchPercentage || 0,
        JSON.stringify(appData.matchingSkills || []),
        JSON.stringify(appData.missingSkills || []),
        JSON.stringify(appData.studentSkillScores || {})
      ]
    );

    // Increment internship applicant count
    await dbRun('UPDATE internships SET applicants_count = applicants_count + 1 WHERE id = ?', [appData.internshipId]);

    res.json({ success: true, applicationId: appId });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Update Application Status
app.put('/api/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await dbRun('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Verify Company (Admin)
app.put('/api/companies/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  try {
    await dbRun('UPDATE companies SET is_verified = ? WHERE id = ?', [isVerified ? 1 : 0, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update company verification' });
  }
});

// Create Post (Experience & Certificates)
app.post('/api/posts', async (req, res) => {
  const postData = req.body;
  const postId = `post_${Date.now()}`;

  try {
    await dbRun(
      `INSERT INTO posts (id, author_id, author_name, author_role, author_college, author_branch, author_avatar, bio_headline, content, post_type, certificates, images, tags, likes_count, liked_by, comments, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postId,
        postData.authorId || 'guest',
        postData.authorName || 'Student',
        postData.authorRole || 'student',
        postData.authorCollege || '',
        postData.authorBranch || '',
        postData.authorAvatar || '',
        postData.bioHeadline || '',
        postData.content,
        postData.postType || 'experience',
        JSON.stringify(postData.certificates || []),
        JSON.stringify(postData.images || []),
        JSON.stringify(postData.tags || []),
        0,
        '[]',
        '[]',
        'Just now'
      ]
    );

    const newPost = {
      id: postId,
      authorId: postData.authorId || 'guest',
      authorName: postData.authorName || 'Student',
      authorRole: postData.authorRole || 'student',
      authorCollege: postData.authorCollege || '',
      authorBranch: postData.authorBranch || '',
      authorAvatar: postData.authorAvatar || '',
      bioHeadline: postData.bioHeadline || '',
      content: postData.content,
      postType: postData.postType || 'experience',
      certificates: postData.certificates || [],
      images: postData.images || [],
      tags: postData.tags || [],
      likesCount: 0,
      likedBy: [],
      comments: [],
      createdAt: 'Just now'
    };

    res.json({ success: true, post: newPost });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like / Toggle Like Post
app.post('/api/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required to like post' });
  }

  try {
    const post = await dbGet('SELECT * FROM posts WHERE id = ?', [id]);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    let likedBy = JSON.parse(post.liked_by || '[]');
    let likesCount = post.likes_count || 0;

    if (likedBy.includes(userId)) {
      likedBy = likedBy.filter(uid => uid !== userId);
      likesCount = Math.max(0, likesCount - 1);
    } else {
      likedBy.push(userId);
      likesCount += 1;
    }

    await dbRun('UPDATE posts SET likes_count = ?, liked_by = ? WHERE id = ?', [likesCount, JSON.stringify(likedBy), id]);
    res.json({ success: true, likesCount, likedBy });
  } catch (err) {
    console.error('Like post error:', err);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Add Comment to Post
app.post('/api/posts/:id/comment', async (req, res) => {
  const { id } = req.params;
  const { authorName, authorAvatar, text } = req.body;

  if (!text) return res.status(400).json({ error: 'Comment text required' });

  try {
    const post = await dbGet('SELECT * FROM posts WHERE id = ?', [id]);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comments = JSON.parse(post.comments || '[]');
    const newComment = {
      id: `comm_${Date.now()}`,
      authorName: authorName || 'Student',
      authorAvatar: authorAvatar || '',
      text,
      createdAt: 'Just now'
    };

    comments.push(newComment);
    await dbRun('UPDATE posts SET comments = ? WHERE id = ?', [JSON.stringify(comments), id]);
    res.json({ success: true, comments });
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete Post
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

