import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Plus,
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Award,
  Eye
} from 'lucide-react';
import { PostInternshipModal } from './PostInternshipModal';
import { Application } from '../types';

interface CompanyDashboardProps {
  onOpenAuth: (role?: 'student' | 'company' | 'admin', isRegister?: boolean) => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ onOpenAuth }) => {
  const { currentCompany, internships, applications, updateApplicationStatus } = useApp();

  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);

  if (!currentCompany) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
          <Building2 className="w-12 h-12 text-purple-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white font-outfit">Company Recruiter Login Required</h2>
          <p className="text-slate-400 text-xs">Please sign in as a company recruiter to post opportunities and review applicant skill profiles.</p>
          <button
            onClick={() => onOpenAuth('company', false)}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg"
          >
            Sign In as Company
          </button>
        </div>
      </div>
    );
  }

  // Filter internships created by this company
  const companyInternships = internships.filter(i => i.companyId === currentCompany.id);
  const companyInternshipIds = companyInternships.map(i => i.id);

  // Applications received for this company's internships
  const receivedApplications = applications.filter(a => companyInternshipIds.includes(a.internshipId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6">
      
      {/* COMPANY HEADER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-indigo-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentCompany.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80'}
              alt={currentCompany.companyName}
              className="w-16 h-16 rounded-2xl object-cover border border-purple-500/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">{currentCompany.companyName}</h1>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  currentCompany.isVerified
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {currentCompany.isVerified ? '✓ Verified Employer' : 'Pending Verification'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{currentCompany.industry} • {currentCompany.location}</p>
            </div>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-2xl shadow-xl shadow-purple-600/30 transition-all hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Post New Internship
          </button>
        </div>
      </div>

      {/* RECRUITER METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xl">
            {companyInternships.length}
          </div>
          <div>
            <p className="text-xs text-slate-400">Active Listings</p>
            <p className="text-lg font-bold text-white font-outfit">Internship Opportunities</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl">
            {receivedApplications.length}
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Applicants</p>
            <p className="text-lg font-bold text-white font-outfit">Verified Candidates</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
            {receivedApplications.filter(a => a.status === 'Shortlisted' || a.status === 'Accepted').length}
          </div>
          <div>
            <p className="text-xs text-slate-400">Shortlisted</p>
            <p className="text-lg font-bold text-white font-outfit">Top Matches</p>
          </div>
        </div>
      </div>

      {/* APPLICANT INBOX */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" /> Applicant Skill Profiles & Inbox
          </h2>
          <p className="text-xs text-slate-400">Review verified skill scores and candidate match analytics</p>
        </div>

        {receivedApplications.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-xs">No candidate applications received yet for your active listings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Candidate Student</th>
                  <th className="py-3 px-4">Applied Position</th>
                  <th className="py-3 px-4">Match %</th>
                  <th className="py-3 px-4">Verified Skill Scores</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {receivedApplications.map(app => {
                  const targetInternship = internships.find(i => i.id === app.internshipId);

                  return (
                    <tr key={app.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm">{app.studentName}</div>
                        <div className="text-[11px] text-slate-400">{app.studentCollege} • {app.studentBranch} ({app.studentYear})</div>
                      </td>

                      <td className="py-4 px-4 font-medium text-slate-300">
                        {targetInternship?.position || 'Software Intern'}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                          app.matchPercentage >= 75
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                          {app.matchPercentage}% Match
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(app.studentSkillScores).map(([skill, score]) => (
                            <span key={skill} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                              {skill}: <strong className="text-indigo-400">{score}%</strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          app.status === 'Shortlisted'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : app.status === 'Accepted'
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : app.status === 'Rejected'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                          {app.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-[11px] font-semibold transition-all"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                            className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-lg text-[11px] font-semibold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* POST INTERNSHIP MODAL */}
      <PostInternshipModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

    </div>
  );
};
