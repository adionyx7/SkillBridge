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
    // simple check: list users count (requires appropriate RLS/privileges)
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

    res.json({ students, companies, internships, applications });
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

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(404).json({ error: 'User account not found. Please register first.' });
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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
