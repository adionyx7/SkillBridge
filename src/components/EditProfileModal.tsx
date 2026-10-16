import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, CheckCircle, Save, User, Building2, Github, Linkedin, ChevronDown, Loader2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─────────────────────────────────────────────────────────────
   ENGINEERING BRANCHES  (all major branches + Other at end)
───────────────────────────────────────────────────────────── */
const ENGINEERING_BRANCHES = [
  'Computer Science Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical Engineering (EE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Aeronautical Engineering',
  'Biomedical Engineering',
  'Biotechnology Engineering',
  'Agricultural Engineering',
  'Food Technology Engineering',
  'Environmental Engineering',
  'Mining Engineering',
  'Metallurgical & Materials Engineering',
  'Industrial Engineering',
  'Production Engineering',
  'Manufacturing Engineering',
  'Automobile Engineering',
  'Marine Engineering',
  'Naval Architecture & Ocean Engineering',
  'Petroleum Engineering',
  'Textile Engineering',
  'Instrumentation Engineering',
  'Control Systems Engineering',
  'Robotics & Automation Engineering',
  'Artificial Intelligence & Machine Learning (AI/ML)',
  'Data Science & Engineering',
  'Cybersecurity Engineering',
  'Internet of Things (IoT)',
  'Mechatronics Engineering',
  'Nuclear Engineering',
  'Structural Engineering',
  'Geotechnical Engineering',
  'Transportation Engineering',
  'Water Resources Engineering',
  'Architecture Engineering',
  'Urban & Regional Planning',
  'Other',
];

/* ─────────────────────────────────────────────────────────────
   INDIA STATES & DISTRICTS  (source: sab99r/Indian-States-And-Districts)
   Fetched at runtime from GitHub raw JSON — no API key needed.
───────────────────────────────────────────────────────────── */
const STATES_DISTRICTS_URL =
  'https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json';

interface StateDistrict {
  state: string;
  districts: string[];
}

/* ─────────────────────────────────────────────────────────────
   SHARED SELECT STYLE
───────────────────────────────────────────────────────────── */
const selectCls =
  'w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer';

const inputCls =
  'w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500';

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { role, currentStudent, currentCompany, updateStudentProfile, updateCompanyProfile } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /* ── State–District data ── */
  const [statesData, setStatesData] = useState<StateDistrict[]>([]);
  const [loadingGeo, setLoadingGeo] = useState(false);

  /* ── Parsed location into state + district ── */
  const parseLocation = (loc: string) => {
    const parts = loc?.split(',').map(s => s.trim()) ?? [];
    if (parts.length >= 2) return { district: parts[0], state: parts[1] };
    return { district: '', state: parts[0] || '' };
  };

  const initLoc = parseLocation(currentStudent?.location || '');

  /* ── Student form ── */
  const [studentForm, setStudentForm] = useState({
    name: currentStudent?.name || '',
    college: currentStudent?.college || '',
    degree: currentStudent?.degree || '',
    branch: currentStudent?.branch || '',
    customBranch: '',
    year: currentStudent?.year || '3rd Year',
    state: initLoc.state,
    district: initLoc.district,
    bio: currentStudent?.bio || '',
    githubUrl: currentStudent?.githubUrl || '',
    linkedinUrl: currentStudent?.linkedinUrl || '',
  });

  /* ── Company form ── */
  const [companyForm, setCompanyForm] = useState({
    companyName: currentCompany?.companyName || '',
    website: currentCompany?.website || '',
    industry: currentCompany?.industry || '',
    location: currentCompany?.location || '',
    description: currentCompany?.description || '',
    logo: currentCompany?.logo || '',
  });

  /* ── Fetch geo data once modal opens ── */
  useEffect(() => {
    if (!isOpen || statesData.length > 0) return;
    setLoadingGeo(true);
    fetch(STATES_DISTRICTS_URL)
      .then(r => r.json())
      .then((json: { states: StateDistrict[] }) => {
        setStatesData(json.states);
      })
      .catch(() => {/* fallback: empty, user can type manually */})
      .finally(() => setLoadingGeo(false));
  }, [isOpen]);

  /* ── Districts for selected state ── */
  const availableDistricts =
    statesData.find(s => s.state === studentForm.state)?.districts ?? [];

  if (!isOpen) return null;

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'student' && currentStudent) {
      const branchValue =
        studentForm.branch === 'Other' ? studentForm.customBranch : studentForm.branch;

      const locationValue = studentForm.district
        ? `${studentForm.district}, ${studentForm.state}`
        : studentForm.state;

      await updateStudentProfile({
        name: studentForm.name,
        college: studentForm.college,
        degree: studentForm.degree,
        branch: branchValue,
        year: studentForm.year,
        location: locationValue,
        bio: studentForm.bio,
        githubUrl: studentForm.githubUrl,
        linkedinUrl: studentForm.linkedinUrl,
      });
      setToastMessage('Student profile successfully updated in database!');
    } else if (role === 'company' && currentCompany) {
      await updateCompanyProfile({ ...companyForm });
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

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
            {role === 'student' ? <User className="w-6 h-6 text-indigo-400" /> : <Building2 className="w-6 h-6 text-purple-400" />}
            Edit Profile Details
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update your personal and professional profile. All updates save directly to the SQLite backend database.
          </p>

          {/* Role Lock Badge */}
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

        {/* Toast */}
        {toastMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {toastMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ══════════════════ STUDENT FIELDS ══════════════════ */}
          {role === 'student' && (
            <>
              {/* Locked role field */}
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

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* College + Degree */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">College / University</label>
                  <input
                    type="text"
                    required
                    value={studentForm.college}
                    onChange={e => setStudentForm({ ...studentForm, college: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Degree</label>
                  <input
                    type="text"
                    required
                    value={studentForm.degree}
                    onChange={e => setStudentForm({ ...studentForm, degree: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Branch (Engineering Dropdown) + Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Branch / Engineering Type</label>
                  <div className="relative">
                    <select
                      required
                      value={studentForm.branch}
                      onChange={e => setStudentForm({ ...studentForm, branch: e.target.value, customBranch: '' })}
                      className={selectCls}
                    >
                      <option value="" disabled>— Select Branch —</option>
                      {ENGINEERING_BRANCHES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  {/* Custom branch text input if "Other" selected */}
                  {studentForm.branch === 'Other' && (
                    <input
                      type="text"
                      required
                      placeholder="Specify your branch…"
                      value={studentForm.customBranch}
                      onChange={e => setStudentForm({ ...studentForm, customBranch: e.target.value })}
                      className={`${inputCls} mt-2`}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Year</label>
                  <div className="relative">
                    <select
                      value={studentForm.year}
                      onChange={e => setStudentForm({ ...studentForm, year: e.target.value })}
                      className={selectCls}
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* ── Location: State → District ── */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-2">
                  Location
                  {loadingGeo && (
                    <span className="flex items-center gap-1 text-[10px] text-indigo-400">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading states…
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* State */}
                  <div className="relative">
                    <select
                      required
                      value={studentForm.state}
                      onChange={e =>
                        setStudentForm({ ...studentForm, state: e.target.value, district: '' })
                      }
                      className={selectCls}
                      disabled={loadingGeo}
                    >
                      <option value="" disabled>— Select State —</option>
                      {statesData.map(s => (
                        <option key={s.state} value={s.state}>{s.state}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>

                  {/* District (only when state is chosen) */}
                  <div className="relative">
                    <select
                      value={studentForm.district}
                      onChange={e =>
                        setStudentForm({ ...studentForm, district: e.target.value })
                      }
                      className={`${selectCls} ${!studentForm.state ? 'opacity-40 cursor-not-allowed' : ''}`}
                      disabled={!studentForm.state || availableDistricts.length === 0}
                    >
                      <option value="">— Select District —</option>
                      {availableDistricts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Preview of combined location */}
                {(studentForm.state || studentForm.district) && (
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    📍 Saved as:{' '}
                    <span className="text-indigo-400 font-medium">
                      {studentForm.district
                        ? `${studentForm.district}, ${studentForm.state}`
                        : studentForm.state}
                    </span>
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Professional Summary</label>
                <textarea
                  rows={2}
                  value={studentForm.bio}
                  onChange={e => setStudentForm({ ...studentForm, bio: e.target.value })}
                  placeholder="Tell recruiters about your key achievements and coding goals…"
                  className={inputCls}
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Github className="w-3.5 h-3.5 text-slate-400" /> GitHub URL
                  </label>
                  <input
                    type="url"
                    value={studentForm.githubUrl}
                    onChange={e => setStudentForm({ ...studentForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5 text-slate-400" /> LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={studentForm.linkedinUrl}
                    onChange={e => setStudentForm({ ...studentForm, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className={inputCls}
                  />
                </div>
              </div>
            </>
          )}

          {/* ══════════════════ COMPANY FIELDS ══════════════════ */}
          {role === 'company' && (
            <>
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
                  placeholder="Overview of company culture, products, and internship programs…"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </>
          )}

          {/* Save Button */}
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
