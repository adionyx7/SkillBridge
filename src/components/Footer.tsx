import React from 'react';
import { GraduationCap, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white font-outfit">SkillBridge</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Connecting student learning with industry skill assessments and verified internship opportunities. Learn, verify skills, and launch your career.
          </p>
          <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Skill Profiling Engine</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider font-outfit">For Students</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#courses" className="hover:text-indigo-400 transition-colors">Explore Skill Courses</a></li>
            <li><a href="#assessments" className="hover:text-indigo-400 transition-colors">Take Skill Assessments</a></li>
            <li><a href="#internships" className="hover:text-indigo-400 transition-colors">Find Internship Matches</a></li>
            <li><a href="#profile" className="hover:text-indigo-400 transition-colors">Build Verified Profile</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider font-outfit">For Companies</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#employers" className="hover:text-indigo-400 transition-colors">Post Internship Positions</a></li>
            <li><a href="#employers" className="hover:text-indigo-400 transition-colors">Verify Company Account</a></li>
            <li><a href="#employers" className="hover:text-indigo-400 transition-colors">Search Verified Candidates</a></li>
            <li><a href="#employers" className="hover:text-indigo-400 transition-colors">Skill Match Scoring</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider font-outfit">Popular Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {['Python', 'React', 'JavaScript', 'SQL', 'Data Science', 'Machine Learning', 'UI/UX', 'Cloud'].map(skill => (
              <span key={skill} className="text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 SkillBridge Platform. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Career Development
        </p>
      </div>
    </footer>
  );
};
