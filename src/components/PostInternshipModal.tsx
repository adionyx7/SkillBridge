import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Briefcase, Plus, Sparkles } from 'lucide-react';

interface PostInternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostInternshipModal: React.FC<PostInternshipModalProps> = ({ isOpen, onClose }) => {
  const { addInternship } = useApp();

  const [form, setForm] = useState({
    position: 'Full-Stack Developer Intern',
    requiredSkills: 'React, Node.js, SQL',
    location: 'Bengaluru, India',
    workMode: 'Hybrid' as 'Remote' | 'Hybrid' | 'On-site',
    duration: '6 Months',
    stipend: '₹35,000 / month',
    description: 'We are seeking an enthusiastic developer intern to build modern web applications and scalable backend APIs.',
    eligibilityRequirements: 'Current CS/IT Student, Proficiency in JavaScript frameworks'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsList = form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    const eligibilityList = form.eligibilityRequirements.split(',').map(e => e.trim()).filter(Boolean);

    addInternship({
      position: form.position,
      requiredSkills: skillsList,
      location: form.location,
      workMode: form.workMode,
      duration: form.duration,
      stipend: form.stipend,
      description: form.description,
      eligibilityRequirements: eligibilityList
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Company Recruiter Portal
          </div>
          <h2 className="text-2xl font-bold text-white font-outfit">Post New Internship Listing</h2>
          <p className="text-xs text-slate-400 mt-1">Specify required skills and eligibility criteria for automated candidate matching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Internship Position Title</label>
            <input
              type="text"
              required
              value={form.position}
              onChange={e => setForm({ ...form, position: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Required Skills (Comma separated)</label>
            <input
              type="text"
              required
              value={form.requiredSkills}
              onChange={e => setForm({ ...form, requiredSkills: e.target.value })}
              placeholder="e.g. Python, React, SQL"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Mode</label>
              <select
                value={form.workMode}
                onChange={e => setForm({ ...form, workMode: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Duration</label>
              <input
                type="text"
                required
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Stipend</label>
            <input
              type="text"
              required
              value={form.stipend}
              onChange={e => setForm({ ...form, stipend: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Role Description</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Publish Internship Opportunity
          </button>
        </form>

      </div>
    </div>
  );
};
