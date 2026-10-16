import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  BookOpen,
  Briefcase,
  Star,
  Clock,
  MapPin,
  Laptop,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { Course, Internship } from '../types';

interface GlobalFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse?: (course: Course) => void;
  onSelectInternship?: (internship: Internship) => void;
  onNavigateView?: (view: 'courses' | 'internships') => void;
}

export const GlobalFilterModal: React.FC<GlobalFilterModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  onSelectInternship,
  onNavigateView
}) => {
  const { courses, internships, currentStudent, calculateInternshipMatch } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'internships'>('courses');
  const [searchQuery, setSearchQuery] = useState('');

  // Course-specific filters
  const [courseSkill, setCourseSkill] = useState('All');
  const [courseDifficulty, setCourseDifficulty] = useState('All');
  const [courseDomain, setCourseDomain] = useState('All');
  const [courseDuration, setCourseDuration] = useState('All');

  // Internship-specific filters
  const [internSkill, setInternSkill] = useState('All');
  const [internLocation, setInternLocation] = useState('All');
  const [internWorkMode, setInternWorkMode] = useState('All');
  const [internMinStipend, setInternMinStipend] = useState(0);
  const [internMinMatch, setInternMinMatch] = useState(0);

  if (!isOpen) return null;

  // --- Options ---
  const skills = ['All', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Data Science', 'Machine Learning', 'UI/UX', 'Cloud Computing', 'Java', 'Docker', 'AWS', 'TypeScript', 'Cybersecurity'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const domains = ['All', 'Web Development', 'Data Science & AI', 'Cloud & DevOps', 'Cybersecurity', 'UI/UX Design', 'Programming Languages'];
  const durations = ['All', 'Short (< 5 hrs)', 'Medium (5–15 hrs)', 'In-depth (15+ hrs)'];
  const locations = ['All', 'Remote', 'Bengaluru', 'Delhi', 'Hyderabad', 'Mumbai', 'Chennai', 'Pune', 'Kolkata', 'Jaipur'];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];
  const stipendOptions = [
    { label: 'Any Stipend', value: 0 },
    { label: '₹5,000+/mo', value: 5000 },
    { label: '₹15,000+/mo', value: 15000 },
    { label: '₹25,000+/mo', value: 25000 },
  ];
  const matchOptions = [
    { label: 'Any Match', value: 0 },
    { label: 'Medium (50%+)', value: 50 },
    { label: 'High (75%+)', value: 75 },
    { label: 'Perfect (90%+)', value: 90 },
  ];

  // --- Helpers ---
  const parseDurationHours = (s: string) => { const m = s.match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
  const parseStipend = (s: string) => { const n = s.replace(/[^0-9]/g, ''); return n ? parseInt(n) : 0; };

  const resetCourseFilters = () => { setCourseSkill('All'); setCourseDifficulty('All'); setCourseDomain('All'); setCourseDuration('All'); setSearchQuery(''); };
  const resetInternFilters = () => { setInternSkill('All'); setInternLocation('All'); setInternWorkMode('All'); setInternMinStipend(0); setInternMinMatch(0); setSearchQuery(''); };
  const resetAll = () => { resetCourseFilters(); resetInternFilters(); };

  const hasCourseFilters = searchQuery !== '' || courseSkill !== 'All' || courseDifficulty !== 'All' || courseDomain !== 'All' || courseDuration !== 'All';
  const hasInternFilters = searchQuery !== '' || internSkill !== 'All' || internLocation !== 'All' || internWorkMode !== 'All' || internMinStipend > 0 || internMinMatch > 0;
  const hasAnyFilter = hasCourseFilters || hasInternFilters;

  // --- Filter results ---
  const filteredCourses = courses.filter(course => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q) || course.skill.toLowerCase().includes(q) || course.instructor.toLowerCase().includes(q);
    const matchesSkill = courseSkill === 'All' || course.skill.toLowerCase().includes(courseSkill.toLowerCase());
    const matchesDiff = courseDifficulty === 'All' || course.difficulty === courseDifficulty;
    const h = parseDurationHours(course.duration);
    const matchesDur = courseDuration === 'All' || (courseDuration === 'Short (< 5 hrs)' ? h < 5 : courseDuration === 'Medium (5–15 hrs)' ? h >= 5 && h <= 15 : h > 15);
    let matchesDomain = true;
    if (courseDomain === 'Web Development') matchesDomain = ['React','JavaScript','Node.js','TypeScript'].some(s => course.skill.includes(s));
    else if (courseDomain === 'Data Science & AI') matchesDomain = ['Data Science','Machine Learning','Python'].some(s => course.skill.includes(s));
    else if (courseDomain === 'Cloud & DevOps') matchesDomain = ['Cloud','Docker','AWS'].some(s => course.skill.includes(s));
    else if (courseDomain === 'Cybersecurity') matchesDomain = course.skill.includes('Cybersecurity');
    else if (courseDomain === 'UI/UX Design') matchesDomain = course.skill.includes('UI/UX');
    else if (courseDomain === 'Programming Languages') matchesDomain = ['Python','Java','TypeScript','JavaScript'].some(s => course.skill.includes(s));
    return matchesSearch && matchesSkill && matchesDiff && matchesDur && matchesDomain;
  });

  const filteredInternships = internships.filter(internship => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || internship.position.toLowerCase().includes(q) || internship.companyName.toLowerCase().includes(q) || internship.requiredSkills.some(s => s.toLowerCase().includes(q));
    const matchesSkill = internSkill === 'All' || internship.requiredSkills.some(s => s.toLowerCase().includes(internSkill.toLowerCase()));
    const matchesLoc = internLocation === 'All' || (internLocation === 'Remote' ? internship.workMode === 'Remote' : internship.location.toLowerCase().includes(internLocation.toLowerCase()));
    const matchesMode = internWorkMode === 'All' || internship.workMode === internWorkMode;
    const matchesStipend = parseStipend(internship.stipend) >= internMinStipend;
    let matchesMatch = true;
    if (internMinMatch > 0 && currentStudent) {
      matchesMatch = calculateInternshipMatch(currentStudent.skills, internship.requiredSkills).matchPercentage >= internMinMatch;
    }
    return matchesSearch && matchesSkill && matchesLoc && matchesMode && matchesStipend && matchesMatch;
  });

  const shownResults = activeTab === 'courses' ? filteredCourses : filteredInternships;

  const selectBtnClass = (active: boolean, color: 'indigo' | 'purple') =>
    `px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 border flex items-center gap-2.5 ${
      active
        ? color === 'indigo'
          ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/25'
          : 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/25'
        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'
    }`;

  const dropClass = `w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none cursor-pointer transition-colors ${activeTab === 'courses' ? 'focus:border-indigo-500' : 'focus:border-purple-500'}`;
  const labelClass = 'text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-outfit">Quick Filter</h2>
              <p className="text-xs text-slate-400">Find courses or internships instantly</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasAnyFilter && (
              <button
                onClick={resetAll}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Tab Selector ── */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-800 bg-slate-900/90 space-y-4">
          
          {/* Big tab buttons — user picks what they want to filter */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('courses')}
              className={selectBtnClass(activeTab === 'courses', 'indigo')}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'courses' ? 'bg-white/20' : 'bg-slate-800'}`}>
                <BookOpen className={`w-4 h-4 ${activeTab === 'courses' ? 'text-white' : 'text-indigo-400'}`} />
              </div>
              <div className="text-left">
                <div>Courses</div>
                <div className={`text-[10px] font-normal ${activeTab === 'courses' ? 'text-indigo-200' : 'text-slate-500'}`}>{filteredCourses.length} found</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('internships')}
              className={selectBtnClass(activeTab === 'internships', 'purple')}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'internships' ? 'bg-white/20' : 'bg-slate-800'}`}>
                <Briefcase className={`w-4 h-4 ${activeTab === 'internships' ? 'text-white' : 'text-purple-400'}`} />
              </div>
              <div className="text-left">
                <div>Internships</div>
                <div className={`text-[10px] font-normal ${activeTab === 'internships' ? 'text-purple-200' : 'text-slate-500'}`}>{filteredInternships.length} found</div>
              </div>
            </button>

            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'courses' ? 'Search courses, skills, instructors...' : 'Search roles, companies, skills...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className={`w-full h-full pl-10 pr-10 py-3 bg-slate-950 border rounded-2xl text-white placeholder-slate-500 focus:outline-none text-sm transition-all ${activeTab === 'courses' ? 'border-slate-700 focus:border-indigo-500' : 'border-slate-700 focus:border-purple-500'}`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ── COURSE FILTERS — shown only when Courses tab is active ── */}
          {activeTab === 'courses' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
              <div>
                <label className={labelClass}>Domain</label>
                <select value={courseDomain} onChange={e => setCourseDomain(e.target.value)} className={dropClass}>
                  {domains.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Skill</label>
                <select value={courseSkill} onChange={e => setCourseSkill(e.target.value)} className={dropClass}>
                  {skills.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Difficulty Level</label>
                <select value={courseDifficulty} onChange={e => setCourseDifficulty(e.target.value)} className={dropClass}>
                  {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Duration</label>
                <select value={courseDuration} onChange={e => setCourseDuration(e.target.value)} className={dropClass}>
                  {durations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── INTERNSHIP FILTERS — shown only when Internships tab is active ── */}
          {activeTab === 'internships' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-fadeIn">
              <div>
                <label className={labelClass}>Skill</label>
                <select value={internSkill} onChange={e => setInternSkill(e.target.value)} className={dropClass}>
                  {skills.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <select value={internLocation} onChange={e => setInternLocation(e.target.value)} className={dropClass}>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Work Mode</label>
                <select value={internWorkMode} onChange={e => setInternWorkMode(e.target.value)} className={dropClass}>
                  {workModes.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Min Stipend</label>
                <select value={internMinStipend} onChange={e => setInternMinStipend(Number(e.target.value))} className={dropClass}>
                  {stipendOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Min Match %</label>
                <select value={internMinMatch} onChange={e => setInternMinMatch(Number(e.target.value))} className={dropClass}>
                  {matchOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {(hasCourseFilters && activeTab === 'courses' || hasInternFilters && activeTab === 'internships') && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {searchQuery && <Chip label={`"${searchQuery}"`} onRemove={() => setSearchQuery('')} color="indigo" />}
              {activeTab === 'courses' && <>
                {courseDomain !== 'All' && <Chip label={`Domain: ${courseDomain}`} onRemove={() => setCourseDomain('All')} color="indigo" />}
                {courseSkill !== 'All' && <Chip label={`Skill: ${courseSkill}`} onRemove={() => setCourseSkill('All')} color="indigo" />}
                {courseDifficulty !== 'All' && <Chip label={`Level: ${courseDifficulty}`} onRemove={() => setCourseDifficulty('All')} color="indigo" />}
                {courseDuration !== 'All' && <Chip label={`Duration: ${courseDuration}`} onRemove={() => setCourseDuration('All')} color="indigo" />}
              </>}
              {activeTab === 'internships' && <>
                {internSkill !== 'All' && <Chip label={`Skill: ${internSkill}`} onRemove={() => setInternSkill('All')} color="purple" />}
                {internLocation !== 'All' && <Chip label={`Location: ${internLocation}`} onRemove={() => setInternLocation('All')} color="purple" />}
                {internWorkMode !== 'All' && <Chip label={`Mode: ${internWorkMode}`} onRemove={() => setInternWorkMode('All')} color="purple" />}
                {internMinStipend > 0 && <Chip label={`Stipend: ₹${internMinStipend.toLocaleString()}+`} onRemove={() => setInternMinStipend(0)} color="emerald" />}
                {internMinMatch > 0 && <Chip label={`Match: ${internMinMatch}%+`} onRemove={() => setInternMinMatch(0)} color="amber" />}
              </>}
            </div>
          )}
        </div>

        {/* ── Results ── */}
        <div className="overflow-y-auto flex-1 p-5">
          {shownResults.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                {activeTab === 'courses' ? <GraduationCap className="w-8 h-8 text-slate-500" /> : <Briefcase className="w-8 h-8 text-slate-500" />}
              </div>
              <h3 className="text-base font-bold text-white mb-1">No {activeTab} match your filters</h3>
              <p className="text-xs text-slate-400 mb-4">Try adjusting or resetting your filters</p>
              <button
                onClick={activeTab === 'courses' ? resetCourseFilters : resetInternFilters}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400 font-medium">
                  Showing <strong className="text-white">{shownResults.length}</strong> {activeTab}
                </p>
                {onNavigateView && (
                  <button
                    onClick={() => { onClose(); onNavigateView(activeTab); }}
                    className={`text-xs font-semibold flex items-center gap-1 ${activeTab === 'courses' ? 'text-indigo-400 hover:text-indigo-300' : 'text-purple-400 hover:text-purple-300'}`}
                  >
                    View all on {activeTab === 'courses' ? 'Courses' : 'Internships'} Page <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Course cards */}
              {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(filteredCourses as Course[]).map(course => (
                    <div
                      key={course.id}
                      onClick={() => { if (onSelectCourse) onSelectCourse(course); onClose(); }}
                      className="bg-slate-800/60 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700/60 hover:border-indigo-500/40 cursor-pointer transition-all flex items-start gap-3 group"
                    >
                      <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20 truncate max-w-[120px]">{course.skill}</span>
                          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5 shrink-0"><Star className="w-3 h-3 fill-amber-400" /> {course.rating}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">{course.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{course.instructor}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                          <span className={`font-semibold ${course.difficulty === 'Beginner' ? 'text-emerald-400' : course.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'}`}>{course.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Internship cards */}
              {activeTab === 'internships' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(filteredInternships as Internship[]).map(internship => {
                    const matchInfo = currentStudent ? calculateInternshipMatch(currentStudent.skills, internship.requiredSkills) : null;
                    return (
                      <div
                        key={internship.id}
                        onClick={() => { if (onSelectInternship) onSelectInternship(internship); else { onClose(); onNavigateView?.('internships'); } }}
                        className="bg-slate-800/60 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700/60 hover:border-purple-500/40 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={internship.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80'}
                              alt={internship.companyName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                            />
                            <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{internship.position}</h4>
                              <p className="text-xs text-slate-400">{internship.companyName}</p>
                            </div>
                          </div>
                          {matchInfo && (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 border ${matchInfo.matchPercentage >= 75 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                              <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />{matchInfo.matchPercentage}% Match
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-purple-400" /> {internship.location}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Laptop className="w-3 h-3 text-indigo-400" /> {internship.workMode}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-400">{internship.stipend}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">Skills: {internship.requiredSkills.slice(0, 4).join(', ')}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span><strong className="text-white">{shownResults.length}</strong> {activeTab} match your filters</span>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Small reusable filter chip
const Chip: React.FC<{ label: string; onRemove: () => void; color: 'indigo' | 'purple' | 'emerald' | 'amber' }> = ({ label, onRemove, color }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 ${colorMap[color]}`}>
      {label}
      <button onClick={onRemove} className="hover:text-white font-bold ml-0.5">✕</button>
    </span>
  );
};
