import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  BookOpen,
  Briefcase,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  BarChart3,
  Users
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenAuth: (role?: 'student' | 'company' | 'admin', isRegister?: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenAuth }) => {
  const { role, currentAdmin, students, companies, courses, internships, applications, verifyCompany } = useApp();
  const [activeTab, setActiveTab] = useState<'companies' | 'students' | 'courses' | 'internships'>('companies');

  if (role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white font-outfit">Admin Portal Access Restricted</h2>
          <p className="text-slate-400 text-xs">Sign in with system administrator credentials to monitor activity and manage platform accounts.</p>
          <button
            onClick={() => onOpenAuth('admin', false)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg"
          >
            Sign In as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6">
      
      {/* ADMIN BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Platform Governance & Oversight
            </div>
            <h1 className="text-3xl font-extrabold text-white font-outfit">Platform Admin Dashboard</h1>
            <p className="text-xs text-slate-300 mt-1">Manage verified employer approvals, student profiles, skill tests, and platform metrics.</p>
          </div>
        </div>
      </div>

      {/* ANALYTICS SUMMARY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Registered Students</span>
            <GraduationCap className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-outfit">{students.length + 15200}</p>
          <p className="text-[11px] text-emerald-400 mt-1">↑ +14% this month</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Verified Employers</span>
            <Building2 className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-outfit">{companies.filter(c => c.isVerified).length}</p>
          <p className="text-[11px] text-slate-400 mt-1">{companies.length} Total Registrations</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Published Courses</span>
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-outfit">{courses.length}</p>
          <p className="text-[11px] text-indigo-400 mt-1">Across 8 Tech Disciplines</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Internship Applications</span>
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-outfit">{applications.length + 840}</p>
          <p className="text-[11px] text-emerald-400 mt-1">88% Skill Match Rate</p>
        </div>
      </div>

      {/* ADMIN MANAGEMENT TABS */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
          {[
            { id: 'companies', label: 'Company Verification Queue', icon: Building2 },
            { id: 'students', label: 'Student Accounts', icon: GraduationCap },
            { id: 'courses', label: 'Course Catalog', icon: BookOpen },
            { id: 'internships', label: 'Active Internships', icon: Briefcase }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: COMPANY VERIFICATION QUEUE */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit">Company Accounts & Verification Controls</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Industry</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Website</th>
                    <th className="py-3 px-4">Verification Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {companies.map(comp => (
                    <tr key={comp.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                        <img
                          src={comp.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80'}
                          alt={comp.companyName}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                        />
                        {comp.companyName}
                      </td>
                      <td className="py-4 px-4 text-slate-300">{comp.industry}</td>
                      <td className="py-4 px-4 text-slate-300">{comp.location}</td>
                      <td className="py-4 px-4 text-indigo-400 underline">{comp.website}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          comp.isVerified
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                          {comp.isVerified ? '✓ Verified' : 'Pending Verification'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => verifyCompany(comp.id, !comp.isVerified)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                            comp.isVerified
                              ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          }`}
                        >
                          {comp.isVerified ? 'Revoke Verification' : 'Verify Company'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit">Student Database</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">College</th>
                    <th className="py-3 px-4">Degree & Branch</th>
                    <th className="py-3 px-4">Verified Skill Scores</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        <div>{s.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{s.email}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{s.college}</td>
                      <td className="py-4 px-4 text-slate-300">{s.degree} - {s.branch} ({s.year})</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(s.skills).map(([skill, score]) => (
                            <span key={skill} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300">
                              {skill}: {score}%
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit">Platform Course Catalog</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(c => (
                <div key={c.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold">
                    <span>{c.skill}</span>
                    <span>⭐ {c.rating}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{c.title}</h4>
                  <p className="text-xs text-slate-400">{c.instructor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INTERNSHIPS */}
        {activeTab === 'internships' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit">Active Internship Postings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {internships.map(i => (
                <div key={i.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-sm">{i.position}</h4>
                  <p className="text-xs text-slate-400">{i.companyName} • {i.location} ({i.stipend})</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {i.requiredSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
