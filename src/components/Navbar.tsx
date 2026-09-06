import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Briefcase, ShieldCheck, LogIn, UserPlus, Sparkles, LayoutDashboard, Edit3 } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (defaultRole?: 'student' | 'company' | 'admin', isRegister?: boolean) => void;
  activeView: 'landing' | 'dashboard' | 'courses' | 'internships';
  setActiveView: (view: 'landing' | 'dashboard' | 'courses' | 'internships') => void;
  onOpenEditProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenEditProfile, activeView, setActiveView }) => {
  const { role, setRole, currentStudent, currentCompany, currentAdmin, logout } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white font-outfit">
                  Skill<span className="text-gradient">Bridge</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3" /> VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">Skill-to-Internship Ecosystem</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
            <button
              onClick={() => setActiveView('landing')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeView === 'landing' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveView('courses')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeView === 'courses' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Explore Courses
            </button>
            <button
              onClick={() => setActiveView('internships')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeView === 'internships' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Find Internships
            </button>
            
            {role !== 'guest' && (
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeView === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-400 hover:bg-indigo-500/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            )}
          </nav>

          {/* Role Indicator & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Demo Quick Role Switcher */}
            <div className="hidden lg:flex items-center bg-slate-900/80 rounded-lg p-1 border border-slate-800 text-xs">
              <span className="text-slate-500 font-medium px-2 text-[10px] uppercase tracking-wider">Demo Role:</span>
              <button
                onClick={() => setRole('student')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                  role === 'student' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3 h-3" /> Student
              </button>
              <button
                onClick={() => setRole('company')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                  role === 'company' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3 h-3" /> Company
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                  role === 'admin' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3" /> Admin
              </button>
            </div>

            {/* Auth Buttons */}
            {role === 'guest' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('student', false)}
                  className="px-4 py-2 text-sm font-semibold text-white border border-slate-600 hover:border-indigo-400 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" /> Login
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('student', true)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> Register
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                    {role === 'student' && (currentStudent?.name.charAt(0) || 'S')}
                    {role === 'company' && (currentCompany?.companyName.charAt(0) || 'C')}
                    {role === 'admin' && 'A'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-white flex items-center gap-1">
                      {role === 'student' && currentStudent?.name}
                      {role === 'company' && currentCompany?.companyName}
                      {role === 'admin' && 'System Admin'}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {role === 'student' && `${currentStudent?.college || 'Student'}`}
                      {role === 'company' && (currentCompany?.isVerified ? '✓ Verified Employer' : 'Pending Verification')}
                      {role === 'admin' && 'Administrator'}
                    </div>
                  </div>
                </button>
                {(role === 'student' || role === 'company') && (
                  <button
                    onClick={onOpenEditProfile}
                    className="text-xs text-indigo-400 hover:text-indigo-300 px-2 flex items-center gap-1 transition-all border-l border-slate-700 ml-1 pl-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )}
                <button
                  onClick={logout}
                  className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-slate-900 transition-all border-l border-slate-700 ml-1 pl-3"
                  title="Sign Out"
                >
                  Logout
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
