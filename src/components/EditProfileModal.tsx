import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, CheckCircle, Save, User, Building2, MapPin, Globe, GraduationCap, FileText, Linkedin, Github } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { role, currentStudent, currentCompany, updateStudentProfile, updateCompanyProfile } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Student Edit State
  const [studentForm, setStudentForm] = useState({
    name: currentStudent?.name || '',
    college: currentStudent?.college || '',
    degree: currentStudent?.degree || '',
    branch: currentStudent?.branch || '',
    year: currentStudent?.year || '3rd Year',
    location: currentStudent?.location || '',
    bio: currentStudent?.bio || '',
    githubUrl: currentStudent?.githubUrl || '',
    linkedinUrl: currentStudent?.linkedinUrl || ''
  });

  // Company Edit State
  const [companyForm, setCompanyForm] = useState({
    companyName: currentCompany?.companyName || '',
    website: currentCompany?.website || '',
    industry: currentCompany?.industry || '',
    location: currentCompany?.location || '',
    description: currentCompany?.description || '',
    logo: currentCompany?.logo || ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'student' && currentStudent) {
      await updateStudentProfile({
        name: studentForm.name,
        college: studentForm.college,
        degree: studentForm.degree,
        branch: studentForm.branch,
        year: studentForm.year,
        location: studentForm.location,
        bio: studentForm.bio,
        githubUrl: studentForm.githubUrl,
        linkedinUrl: studentForm.linkedinUrl
      });
      setToastMessage('Student profile successfully updated in database!');
    } else if (role === 'company' && currentCompany) {
      await updateCompanyProfile({
        companyName: companyForm.companyName,
        website: companyForm.website,
        industry: companyForm.industry,
        location: companyForm.location,
        description: companyForm.description,
        logo: companyForm.logo
      });
      setToastMessage('Company profile successfully updated in database!');
    }

    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
            {role === 'student' ? <User className="w-6 h-6 text-indigo-400" /> : <Building2 className="w-6 h-6 text-purple-400" />}
            Edit Profile Details
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update your personal and professional profile. All updates save directly to the SQLite backend database.
          </p>

          {/* PERMANENT ROLE LOCK BADGE */}
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Account Type: <strong className="uppercase text-amber-200">{role}</strong></span>
            </div>
            <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
              🔒 Locked (Cannot change account type)
            </span>
          </div>
        </div>

        {toastMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {toastMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* STUDENT PROFILE EDIT FIELDS */}
          {role === 'student' && (
            <>
              {/* Account Type Locked Field */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Account Type (Fixed)
                </label>
                <input
                  type="text"
                  disabled
                  value="Student Account (Role cannot be changed after registration)"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-400 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">College / University</label>
                  <input
                    type="text"
                    required
                    value={studentForm.college}
                    onChange={e => setStudentForm({ ...studentForm, college: e.target.value })}
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
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Professional Summary</label>
                <textarea
                  rows={2}
                  value={studentForm.bio}
                  onChange={e => setStudentForm({ ...studentForm, bio: e.target.value })}
                  placeholder="Tell recruiters about your key achievements and coding goals..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Github className="w-3.5 h-3.5 text-slate-400" /> GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={studentForm.githubUrl}
                    onChange={e => setStudentForm({ ...studentForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5 text-slate-400" /> LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={studentForm.linkedinUrl}
                    onChange={e => setStudentForm({ ...studentForm, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* COMPANY PROFILE EDIT FIELDS */}
          {role === 'company' && (
            <>
              {/* Account Type Locked Field */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Account Type (Fixed)
                </label>
                <input
                  type="text"
                  disabled
                  value="Company Recruiter Account (Role cannot be changed after registration)"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-400 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyForm.companyName}
                  onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

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
                    placeholder="e.g. Software & AI Solutions"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={companyForm.location}
                    onChange={e => setCompanyForm({ ...companyForm, location: e.target.value })}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={companyForm.logo}
                    onChange={e => setCompanyForm({ ...companyForm, logo: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Description</label>
                <textarea
                  rows={3}
                  value={companyForm.description}
                  onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })}
                  placeholder="Overview of company culture, products, and internship programs..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white text-sm shadow-lg transition-all flex items-center justify-center gap-2 mt-6 ${
              role === 'student'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-600/30'
            }`}
          >
            <Save className="w-4 h-4" /> Save Profile Updates to Database
          </button>
        </form>

      </div>
    </div>
  );
};
