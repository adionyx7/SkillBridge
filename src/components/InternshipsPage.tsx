import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  MapPin,
  Laptop,
  Building2,
  DollarSign,
  Calendar,
  Users,
  Filter,
  Search,
  ChevronDown,
  Check,
  Sparkles,
  TrendingUp,
  Award,
  Star,
  BookOpen
} from 'lucide-react';
import { Internship, CompanyProfile } from '../types';

export const InternshipsPage: React.FC = () => {
  const { internships, currentStudent, calculateInternshipMatch, applyForInternship, currentCompany, companies } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  const allSkills = ['All', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Data Science', 'Machine Learning', 'UI/UX', 'Cybersecurity', 'Cloud Computing', 'Java', 'TypeScript', 'Docker', 'AWS'];
  const locations = ['All', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Remote'];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill = selectedSkill === 'All' || internship.requiredSkills.includes(selectedSkill);
    const matchesLocation = selectedLocation === 'All' || internship.location.includes(selectedLocation);
    const matchesWorkMode = selectedWorkMode === 'All' || internship.workMode === selectedWorkMode;
    return matchesSearch && matchesSkill && matchesLocation && matchesWorkMode;
  });

  const sortedInternships = [...filteredInternships].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return 0;
      case 'stipend': return 0;
      case 'match': {
        const studentSkills = currentStudent?.skills || { Python: 75, JavaScript: 70, React: 60 };
        const matchA = calculateInternshipMatch(studentSkills, a.requiredSkills);
        const matchB = calculateInternshipMatch(studentSkills, b.requiredSkills);
        return matchB.matchPercentage - matchA.matchPercentage;
      }
      case 'applicants': return (b.applicantsCount || 0) - (a.applicantsCount || 0);
      default: return 0;
    }
  });

  const hasApplied = (internshipId: string) => {
    // This would need access to applications - simplified for now
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Page Header */}
      <header className="relative pt-16 lg:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Skill-Matched Internship Opportunities</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-outfit leading-tight">
                Find <span className="text-gradient">Internships</span>
              </h1>
              <p className="text-slate-300 text-sm mt-1">Discover opportunities matched to your verified skills</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Smart matching algorithm calculates exact skill compatibility. Apply with one click and get shortlisted by verified companies.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 rounded-2xl glass-panel border border-slate-800">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">{internships.length}</p>
              <p className="text-xs text-slate-400">Active Opportunities</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-outfit">{internships.filter(i => i.workMode === 'Remote').length}</p>
              <p className="text-xs text-slate-400">Remote Positions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-outfit">{companies.filter(c => c.isVerified).length}</p>
              <p className="text-xs text-slate-400">Verified Companies</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-outfit">{currentStudent ? internships.filter(i => {
                const match = calculateInternshipMatch(currentStudent.skills, i.requiredSkills);
                return match.matchPercentage >= 75;
              }).length : 0}</p>
              <p className="text-xs text-slate-400">High Match for You</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search internships by role, company, skill, or location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Filter Chips & Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={selectedSkill}
                  onChange={e => setSelectedSkill(e.target.value)}
                  className="pl-10 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {allSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                </select>
              </div>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="pl-4 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="relative">
                <select
                  value={selectedWorkMode}
                  onChange={e => setSelectedWorkMode(e.target.value)}
                  className="pl-4 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {workModes.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort:</span>
              <div className="relative">
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="pl-4 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="match">Best Skill Match</option>
                  <option value="applicants">Fewest Applicants</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internships Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-white font-outfit">
            All Opportunities ({sortedInternships.length})
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span>{internships.length} positions from {new Set(internships.map(i => i.companyName)).size} companies</span>
          </div>
        </div>

        {sortedInternships.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No internships found</h3>
            <p className="text-slate-400">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedInternships.map(internship => {
              const studentSkills = currentStudent?.skills || { Python: 75, JavaScript: 70, React: 60, SQL: 65, 'Data Science': 50 };
              const matchInfo = calculateInternshipMatch(studentSkills, internship.requiredSkills);
              const applied = hasApplied(internship.id);

              return (
                <div key={internship.id} className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between group">
                  <div>
                    {/* Company & Role */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={internship.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80'}
                          alt={internship.companyName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <h3 className="font-bold text-base text-white font-outfit">{internship.position}</h3>
                          <p className="text-xs text-slate-400 font-medium">{internship.companyName}</p>
                        </div>
                      </div>

                      {/* Match Badge */}
                      <div className={`px-3 py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 shrink-0 ${
                        matchInfo.matchPercentage >= 75
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : matchInfo.matchPercentage >= 50
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        {matchInfo.matchPercentage}% Match
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {internship.location}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5 text-indigo-400" /> {internship.workMode}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /> {internship.duration}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-400"><DollarSign className="w-3.5 h-3.5" /> {internship.stipend}</span>
                    </div>

                    {/* Required Skills with Match Indicators */}
                    <div className="mb-4">
                      <p className="text-[11px] text-slate-400 mb-2 font-medium">Required Skills:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {internship.requiredSkills.map(skill => {
                          const isMatched = matchInfo.matchingSkills.includes(skill);
                          return (
                            <span
                              key={skill}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${
                                isMatched
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                  : 'bg-slate-800 border-slate-700 text-slate-400'
                              }`}
                            >
                              {isMatched && <Check className="w-3 h-3 text-emerald-400" />}
                              {skill}
                            </span>
                          );
                        })}
                        {matchInfo.missingSkills.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 border-rose-500/30 text-rose-300 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {matchInfo.missingSkills.length} gap{matchInfo.missingSkills.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Eligibility & Description */}
                    <div className="mb-4 p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
                      <p className="text-[11px] text-slate-400 mb-1 font-medium">Eligibility:</p>
                      <p className="text-[11px] text-slate-300">{internship.eligibilityRequirements?.[0] || 'Open to students with relevant skills'}</p>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{internship.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {internship.applicantsCount} applicants</span>
                      <span>•</span>
                      <span>{internship.postedDate}</span>
                    </div>
                    <button
                      onClick={() => currentStudent ? applyForInternship(internship.id) : alert('Please login to apply')}
                      disabled={applied}
                      className={`px-5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                        applied
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                          : currentStudent
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      {applied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Applied
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Apply Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Career Resources Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
            Career Resources
          </h2>
          <p className="text-slate-400 text-sm">
            Tools and guides to help you land your dream internship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Resume Builder',
              desc: 'AI-powered resume optimizer tailored for tech internships',
              icon: FileText,
              action: 'Build Resume'
            },
            {
              title: 'Interview Prep',
              desc: 'Technical & behavioral questions with model answers',
              icon: HelpCircle,
              action: 'Start Prep'
            },
            {
              title: 'Salary Insights',
              desc: 'Real stipend data by role, location, and company size',
              icon: BarChart3,
              action: 'View Data'
            }
          ].map((resource, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-6 border border-slate-800 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4">
                <resource.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-outfit">{resource.title}</h3>
              <p className="text-xs text-slate-400 mb-4">{resource.desc}</p>
              <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-semibold text-white transition-all">
                {resource.action}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Missing icons - add inline
function FileText({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
}
function HelpCircle({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
function BarChart3({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
}