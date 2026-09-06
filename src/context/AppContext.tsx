import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  StudentProfile,
  CompanyProfile,
  AdminProfile,
  Course,
  Quiz,
  Internship,
  Application,
  ApplicationStatus
} from '../types';
import { initialCourses, initialQuizzes, initialAdmin } from '../data/mockData';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthResult {
  success: boolean;
  error?: string;
  needsEmailConfirm?: boolean;
}

interface MatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  isEligible: boolean;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentStudent: StudentProfile | null;
  currentCompany: CompanyProfile | null;
  currentAdmin: AdminProfile | null;
  students: StudentProfile[];
  companies: CompanyProfile[];
  courses: Course[];
  quizzes: Record<string, Quiz>;
  internships: Internship[];
  applications: Application[];
  activeQuiz: Quiz | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
  activeCourse: Course | null;
  setActiveCourse: (course: Course | null) => void;
  loginAsStudent: (email: string, password: string) => Promise<AuthResult>;
  loginAsCompany: (email: string, password: string) => Promise<AuthResult>;
  loginAsAdmin: (email: string, password: string) => Promise<AuthResult>;
  loginWithProvider: (provider: 'google', role: 'student' | 'company') => Promise<AuthResult>;
  logout: () => Promise<void>;
  registerStudent: (student: any) => Promise<AuthResult>;
  registerCompany: (company: any) => Promise<AuthResult>;
  updateStudentProfile: (updates: any) => Promise<void>;
  updateCompanyProfile: (updates: any) => Promise<void>;
  calculateInternshipMatch: (studentSkills: Record<string, number>, requiredSkills: string[]) => MatchResult;
  applyForInternship: (internshipId: string) => Promise<boolean>;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => Promise<void>;
  updateSkillScore: (skillName: string, score: number) => Promise<void>;
  verifyCompany: (companyId: string, isVerified: boolean) => Promise<void>;
  addInternship: (internshipData: any) => Promise<void>;
  enrollCourse: (courseId: string) => Promise<void>;
  completeCourse: (courseId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const API_URL = 'http://localhost:5001/api';

function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    const message = error.message.toLowerCase();
    if (message.includes('email rate limit exceeded')) {
      return 'Supabase email limit reached. Wait a while before trying again, or configure custom SMTP in Supabase for higher limits.';
    }
    return error.message;
  }
  return fallback;
}

function roleFromSupabaseUser(user: any): UserRole {
  const role = user.user_metadata?.role as UserRole | undefined;
  if (role === 'student' || role === 'company' || role === 'admin') return role;
  const pendingRole = window.localStorage.getItem('skillbridge_oauth_role') as UserRole | null;
  if (pendingRole === 'student' || pendingRole === 'company') return pendingRole;
  return 'student';
}

async function fetchLocalProfile(email: string) {
  const res = await fetch(`${API_URL}/auth/profile?email=${encodeURIComponent(email)}`);
  if (!res.ok) return null;
  return res.json();
}

async function createLocalProfile(payload: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, password: payload.password || 'supabase-auth' })
  });
  if (!res.ok) {
    return fetchLocalProfile(String(payload.email || ''));
  }
  return res.json();
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('guest');
  
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  
  const [courses] = useState<Course[]>(initialCourses);
  const [quizzes] = useState<Record<string, Quiz>>(initialQuizzes);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [currentCompany, setCurrentCompany] = useState<CompanyProfile | null>(null);
  const currentAdmin = initialAdmin;

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/data`);
      const data = await res.json();
      setStudents(data.students || []);
      setCompanies(data.companies || []);
      setInternships(data.internships || []);
      setApplications(data.applications || []);
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  const calculateInternshipMatch = (studentSkills: Record<string, number>, requiredSkills: string[]): MatchResult => {
    if (!requiredSkills || requiredSkills.length === 0) {
      return { matchPercentage: 100, matchingSkills: [], missingSkills: [], isEligible: true };
    }

    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];
    let totalScoreSum = 0;

    requiredSkills.forEach(skill => {
      const studentScore = studentSkills[skill] || 0;
      if (studentScore >= 50) {
        matchingSkills.push(skill);
        totalScoreSum += studentScore;
      } else {
        missingSkills.push(skill);
      }
    });

    const matchRatio = matchingSkills.length / requiredSkills.length;
    const avgScore = matchingSkills.length > 0 ? totalScoreSum / matchingSkills.length : 0;
    
    const matchPercentage = Math.round((matchRatio * 0.7 + (avgScore / 100) * 0.3) * 100);
    const isEligible = matchPercentage >= 65;

    return {
      matchPercentage: Math.min(100, Math.max(10, matchPercentage)),
      matchingSkills,
      missingSkills,
      isEligible
    };
  };

  const hydrateSupabaseUser = async (user: any) => {
    const accountRole = roleFromSupabaseUser(user);
    window.localStorage.removeItem('skillbridge_oauth_role');
    const email = user.email || String(user.user_metadata?.email || '');
    const meta = user.user_metadata || {};

    if (accountRole === 'admin') {
      setCurrentStudent(null);
      setCurrentCompany(null);
      setRole('admin');
      return;
    }

    let local = email ? await fetchLocalProfile(email) : null;

    if (!local?.success && email) {
      if (accountRole === 'company') {
        local = await createLocalProfile({
          role: 'company',
          email,
          companyName: meta.companyName || meta.name || 'Company',
          website: meta.website || '',
          industry: meta.industry || 'Technology',
          location: meta.location || 'India',
          description: meta.description || ''
        });
      } else {
        local = await createLocalProfile({
          role: 'student',
          email,
          name: meta.name || email.split('@')[0],
          college: meta.college || 'University',
          degree: meta.degree || 'B.Tech',
          branch: meta.branch || 'Computer Science',
          year: meta.year || '3rd Year',
          location: meta.location || 'India'
        });
      }
    }

    if (accountRole === 'company' && local?.profile) {
      setCurrentCompany(local.profile);
      setCurrentStudent(null);
      setRole('company');
    } else if (local?.profile) {
      setCurrentStudent(local.profile);
      setCurrentCompany(null);
      setRole('student');
    }

    fetchData();
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (session?.user && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
        if (event !== 'TOKEN_REFRESHED') {
          await hydrateSupabaseUser(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setRole('guest');
        setCurrentStudent(null);
        setCurrentCompany(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── LOCAL (SQLite) AUTH ───────────────────────────────────────────────────
  const localLogin = async (email: string, password: string, role: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, role })
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, error: data.error || 'Login failed.' };

      // Verify role matches
      if (role !== 'admin' && data.user?.role !== role) {
        return { success: false, error: `This account is registered as a ${data.user?.role}. Use the ${data.user?.role} login tab.` };
      }

      if (data.user?.role === 'admin') {
        setCurrentStudent(null);
        setCurrentCompany(null);
        setRole('admin');
      } else if (data.user?.role === 'company' && data.profile) {
        setCurrentCompany(data.profile);
        setCurrentStudent(null);
        setRole('company');
      } else if (data.profile) {
        setCurrentStudent(data.profile);
        setCurrentCompany(null);
        setRole('student');
      }
      fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: getAuthErrorMessage(err, 'Unable to connect to server. Make sure the backend is running (npm run server).') };
    }
  };

  const localRegister = async (payload: any): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, error: data.error || 'Registration failed.' };

      if (data.user?.role === 'company' && data.profile) {
        setCurrentCompany(data.profile);
        setCurrentStudent(null);
        setRole('company');
      } else if (data.profile) {
        setCurrentStudent(data.profile);
        setCurrentCompany(null);
        setRole('student');
      }
      fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: getAuthErrorMessage(err, 'Unable to connect to server. Make sure the backend is running (npm run server).') };
    }
  };

  // ─── SUPABASE AUTH ─────────────────────────────────────────────────────────
  const supabaseLogin = async (email: string, password: string, expectedRole: string): Promise<AuthResult> => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) return { success: false, error: getAuthErrorMessage(error, 'Unable to log in.') };
      if (!data.user) return { success: false, error: 'Login failed. Please try again.' };

      const accountRole = roleFromSupabaseUser(data.user);
      if (expectedRole !== 'admin' && accountRole !== expectedRole) {
        await supabase.auth.signOut();
        return { success: false, error: `This account is registered as a ${accountRole}. Use the ${accountRole} login tab.` };
      }
      await hydrateSupabaseUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: getAuthErrorMessage(err, 'Unable to log in.') };
    }
  };

  // ─── PUBLIC AUTH API ───────────────────────────────────────────────────────
  const loginAsStudent = async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured()) return localLogin(email, password, 'student');
    return supabaseLogin(email, password, 'student');
  };

  const loginAsCompany = async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured()) return localLogin(email, password, 'company');
    return supabaseLogin(email, password, 'company');
  };

  const loginAsAdmin = async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured()) return localLogin(email, password, 'admin');
    return supabaseLogin(email, password, 'admin');
  };

  const loginWithProvider = async (provider: 'google', accountRole: 'student' | 'company'): Promise<AuthResult> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Social login requires Supabase. Add VITE_SUPABASE_URL to .env and enable the provider in Supabase Auth.' };
    }

    try {
      window.localStorage.setItem('skillbridge_oauth_role', accountRole);
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: getAuthErrorMessage(err, 'Unable to start social login.') };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured()) {
        await getSupabase().auth.signOut();
      }
    } catch (err) {
      console.error(err);
    }
    setRole('guest');
    setCurrentStudent(null);
    setCurrentCompany(null);
  };

  const registerStudent = async (studentData: any): Promise<AuthResult> => {
    if (!isSupabaseConfigured()) {
      return localRegister({
        role: 'student',
        email: studentData.email,
        password: studentData.password,
        name: studentData.name,
        college: studentData.college,
        degree: studentData.degree,
        branch: studentData.branch,
        year: studentData.year,
        location: studentData.location
      });
    }
    try {
      const supabase = getSupabase();
      const email = String(studentData.email || '').trim();
      const password = String(studentData.password || '');
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { role: 'student', name: studentData.name, college: studentData.college, degree: studentData.degree, branch: studentData.branch, year: studentData.year, location: studentData.location } }
      });
      if (error) return { success: false, error: error.message };
      if (!data.user) return { success: false, error: 'Registration failed.' };
      await createLocalProfile({ role: 'student', email, name: studentData.name, college: studentData.college, degree: studentData.degree, branch: studentData.branch, year: studentData.year, location: studentData.location });
      if (!data.session) return { success: true, needsEmailConfirm: true, error: 'Account created. Confirm your email, then log in.' };
      await hydrateSupabaseUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: getAuthErrorMessage(err, 'Unable to register.') };
    }
  };

  const registerCompany = async (companyData: any): Promise<AuthResult> => {
    if (!isSupabaseConfigured()) {
      return localRegister({
        role: 'company',
        email: companyData.email,
        password: companyData.password,
        companyName: companyData.companyName,
        website: companyData.website,
        industry: companyData.industry,
        location: companyData.location,
        description: companyData.description
      });
    }
    try {
      const supabase = getSupabase();
      const email = String(companyData.email || '').trim();
      const password = String(companyData.password || '');
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { role: 'company', companyName: companyData.companyName, website: companyData.website, industry: companyData.industry, location: companyData.location, description: companyData.description } }
      });
      if (error) return { success: false, error: error.message };
      if (!data.user) return { success: false, error: 'Registration failed.' };
      await createLocalProfile({ role: 'company', email, companyName: companyData.companyName, website: companyData.website, industry: companyData.industry, location: companyData.location, description: companyData.description });
      if (!data.session) return { success: true, needsEmailConfirm: true, error: 'Account created. Confirm your email, then log in.' };
      await hydrateSupabaseUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: getAuthErrorMessage(err, 'Unable to register.') };
    }
  };

  const updateStudentProfile = async (updates: any) => {
    if (!currentStudent) return;
    try {
      const res = await fetch(`${API_URL}/students/${currentStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentStudent(data.profile);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const updateCompanyProfile = async (updates: any) => {
    if (!currentCompany) return;
    try {
      const res = await fetch(`${API_URL}/companies/${currentCompany.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentCompany(data.profile);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const updateSkillScore = async (skillName: string, score: number) => {
    if (!currentStudent) return;
    const currentScore = currentStudent.skills[skillName] || 50;
    const newScore = Math.min(100, Math.max(currentScore, score));
    const newSkills = { ...currentStudent.skills, [skillName]: newScore };
    await updateStudentProfile({ skills: newSkills });
  };

  const enrollCourse = async (courseId: string) => {
    if (!currentStudent) return;
    if (!currentStudent.enrolledCourses.includes(courseId)) {
      await updateStudentProfile({ enrolledCourses: [...currentStudent.enrolledCourses, courseId] });
    }
  };

  const completeCourse = async (courseId: string) => {
    if (!currentStudent) return;
    if (!currentStudent.completedCourses.includes(courseId)) {
      const course = courses.find(c => c.id === courseId);
      const updatedSkills = { ...currentStudent.skills };
      if (course) {
        updatedSkills[course.skill] = Math.min(100, (updatedSkills[course.skill] || 50) + 15);
      }
      await updateStudentProfile({
        completedCourses: [...currentStudent.completedCourses, courseId],
        skills: updatedSkills
      });
    }
  };

  const applyForInternship = async (internshipId: string): Promise<boolean> => {
    if (!currentStudent) return false;
    const existing = applications.find(a => a.studentId === currentStudent.id && a.internshipId === internshipId);
    if (existing) return false;
    
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return false;

    const matchInfo = calculateInternshipMatch(currentStudent.skills, internship.requiredSkills);
    
    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipId,
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          studentEmail: currentStudent.email,
          studentCollege: currentStudent.college,
          studentBranch: currentStudent.branch,
          studentYear: currentStudent.year,
          matchPercentage: matchInfo.matchPercentage,
          matchingSkills: matchInfo.matchingSkills,
          missingSkills: matchInfo.missingSkills,
          studentSkillScores: currentStudent.skills
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const addInternship = async (internshipData: any) => {
    if (!currentCompany) return;
    try {
      const res = await fetch(`${API_URL}/internships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...internshipData,
          companyId: currentCompany.id,
          companyName: currentCompany.companyName,
          companyLogo: currentCompany.logo
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    try {
      await fetch(`${API_URL}/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const verifyCompany = async (companyId: string, isVerified: boolean) => {
    try {
      await fetch(`${API_URL}/companies/${companyId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified })
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <AppContext.Provider value={{
      role, setRole, currentStudent, currentCompany, currentAdmin,
      students, companies, courses, quizzes, internships, applications,
      activeQuiz, setActiveQuiz, activeCourse, setActiveCourse,
      loginAsStudent, loginAsCompany, loginAsAdmin, loginWithProvider, logout,
      registerStudent, registerCompany, updateStudentProfile, updateCompanyProfile,
      calculateInternshipMatch, applyForInternship, updateApplicationStatus,
      updateSkillScore, verifyCompany, addInternship, enrollCourse, completeCourse
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
