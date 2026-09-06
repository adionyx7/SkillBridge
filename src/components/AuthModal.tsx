import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, GraduationCap, Briefcase, ShieldCheck, LogIn, UserPlus, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  isRegisterDefault?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'student',
  isRegisterDefault = false
}) => {
  const { loginAsStudent, loginAsCompany, loginAsAdmin, loginWithProvider, registerStudent, registerCompany } = useApp();

  const [activeTab, setActiveTab] = useState<UserRole>(defaultRole === 'guest' ? 'student' : defaultRole);
  const [isRegister, setIsRegister] = useState<boolean>(isRegisterDefault);

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    name: 'Alex Morgan',
    email: 'alex.student@example.com',
    password: 'password123',
    college: 'IIT Bombay',
    degree: 'B.Tech',
    branch: 'Computer Science',
    year: '3rd Year',
    location: 'Mumbai, India'
  });

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    companyName: 'TechCorp Innovations',
    email: 'recruiter@techcorp.com',
    password: 'password123',
    website: 'https://techcorp.example.com',
    industry: 'Software Solutions & AI',
    location: 'Bengaluru, India',
    description: 'Empowering future software innovators and cloud architects.'
  });

  // Admin Form State
  const [adminForm, setAdminForm] = useState({
    email: 'admin@skillintern.com',
    password: 'adminsecretkey'
  });

  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultRole === 'guest' ? 'student' : defaultRole);
      setIsRegister(isRegisterDefault);
      setErrorMsg('');
    }
  }, [isOpen, defaultRole, isRegisterDefault]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'student') {
      if (isRegister) {
        if (!studentForm.name || !studentForm.email || !studentForm.college || !studentForm.password) {
          setErrorMsg('Please fill in all required student details.');
          return;
        }
        const result = await registerStudent({
          name: studentForm.name,
          email: studentForm.email,
          password: studentForm.password,
          college: studentForm.college,
          degree: studentForm.degree,
          branch: studentForm.branch,
          year: studentForm.year,
          location: studentForm.location
        });
        if (!result.success) {
          setErrorMsg(result.error || 'Unable to register student.');
          return;
        }
      } else {
        const result = await loginAsStudent(studentForm.email, studentForm.password);
        if (!result.success) {
          setErrorMsg(result.error || 'Student account not found. Click Register to create an account.');
          return;
        }
      }
    } else if (activeTab === 'company') {
      if (isRegister) {
        if (!companyForm.companyName || !companyForm.email || !companyForm.password) {
          setErrorMsg('Please fill in required company fields.');
          return;
        }
        const result = await registerCompany({
          companyName: companyForm.companyName,
          email: companyForm.email,
          password: companyForm.password,
          website: companyForm.website,
          industry: companyForm.industry,
          location: companyForm.location,
          description: companyForm.description
        });
        if (!result.success) {
          setErrorMsg(result.error || 'Unable to register company.');
          return;
        }
      } else {
        const result = await loginAsCompany(companyForm.email, companyForm.password);
        if (!result.success) {
          setErrorMsg(result.error || 'Company account not found. Please register your company.');
          return;
        }
      }
    } else if (activeTab === 'admin') {
      const result = await loginAsAdmin(adminForm.email, adminForm.password);
      if (!result.success) {
        setErrorMsg(result.error || 'Admin login failed.');
        return;
      }
    }

    onClose();
  };

  const handleSocialLogin = async (provider: 'google') => {
    setErrorMsg('');
    const result = await loginWithProvider(provider, activeTab as 'student' | 'company');
    if (!result.success) setErrorMsg(result.error || 'Unable to start social login.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> SkillBridge Authentication
            </div>
            {isSupabaseConfigured() ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium" title="Supabase Cloud Auth active">
                <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Connected
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium" title="Using Local SQLite Server Auth">
                <Database className="w-3.5 h-3.5" /> Local SQLite Auth
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white font-outfit">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your role-specific dashboard and verified tools
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 mb-6">
          <button
            onClick={() => { setActiveTab('student'); setErrorMsg(''); }}
            className={`py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'student'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Student
          </button>
          <button
            onClick={() => { setActiveTab('company'); setErrorMsg(''); }}
            className={`py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'company'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Company
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
            className={`py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* STUDENT AUTH FIELDS */}
          {activeTab === 'student' && (
            <>
              {isRegister && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Student Email</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="alex.student@example.com"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={studentForm.password}
                  onChange={e => setStudentForm({ ...studentForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {isRegister && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">College/University</label>
                      <input
                        type="text"
                        required
                        value={studentForm.college}
                        onChange={e => setStudentForm({ ...studentForm, college: e.target.value })}
                        placeholder="e.g. IIT Bombay"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Degree</label>
                      <input
                        type="text"
                        required
                        value={studentForm.degree}
                        onChange={e => setStudentForm({ ...studentForm, degree: e.target.value })}
                        placeholder="e.g. B.Tech"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Branch</label>
                      <input
                        type="text"
                        required
                        value={studentForm.branch}
                        onChange={e => setStudentForm({ ...studentForm, branch: e.target.value })}
                        placeholder="CS / IT / ECE"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Year</label>
                      <select
                        value={studentForm.year}
                        onChange={e => setStudentForm({ ...studentForm, year: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                      <input
                        type="text"
                        required
                        value={studentForm.location}
                        onChange={e => setStudentForm({ ...studentForm, location: e.target.value })}
                        placeholder="City"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* COMPANY AUTH FIELDS */}
          {activeTab === 'company' && (
            <>
              {isRegister && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyForm.companyName}
                    onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                    placeholder="e.g. TechCorp Innovations"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={companyForm.email}
                  onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                  placeholder="recruiter@company.com"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={companyForm.password}
                  onChange={e => setCompanyForm({ ...companyForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {isRegister && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Website</label>
                      <input
                        type="url"
                        value={companyForm.website}
                        onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })}
                        placeholder="https://company.com"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Industry</label>
                      <input
                        type="text"
                        value={companyForm.industry}
                        onChange={e => setCompanyForm({ ...companyForm, industry: e.target.value })}
                        placeholder="e.g. AI / Fintech / Software"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Company Description</label>
                    <textarea
                      rows={2}
                      value={companyForm.description}
                      onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })}
                      placeholder="Short bio about the company..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* ADMIN AUTH FIELDS */}
          {activeTab === 'admin' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={e => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Security Key / Password</label>
                <input
                  type="password"
                  required
                  value={adminForm.password}
                  onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'student'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
                : activeTab === 'company'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-600/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
            }`}
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isRegister ? `Register as ${activeTab.toUpperCase()}` : `Login to ${activeTab.toUpperCase()} Portal`}
          </button>
        </form>

        {activeTab !== 'admin' && (
          <>
            <div className="flex items-center gap-3 my-5 text-[11px] text-slate-500 uppercase tracking-wider">
              <div className="h-px flex-1 bg-slate-800" />
              <span>Or continue with</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="py-2.5 rounded-lg border border-slate-700 bg-slate-900/80 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <span className="text-rose-400 mr-1">G</span> Google
              </button>
            </div>
          </>
        )}

        {activeTab !== 'admin' && (
          <div className="mt-5 text-center text-xs text-slate-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
            >
              {isRegister ? 'Sign In Here' : 'Register Now'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
