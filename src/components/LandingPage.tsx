import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  Briefcase,
  TrendingUp,
  Star,
  Users,
  Clock,
  Building2,
  MapPin,
  Laptop,
  Compass,
  Check,
  Zap,
  GraduationCap
} from 'lucide-react';
import { Course, Internship } from '../types';

interface LandingPageProps {
  onOpenAuth: (role?: 'student' | 'company' | 'admin', isRegister?: boolean) => void;
  setActiveView: (view: 'landing' | 'dashboard' | 'courses' | 'internships') => void;
  showWhySection?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, setActiveView, showWhySection = true }) => {
  const { courses, internships, currentStudent, calculateInternshipMatch, applyForInternship, setActiveCourse, setActiveQuiz } = useApp();
  
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const popularSkills = [
    'All',
    'Python',
    'Java',
    'JavaScript',
    'React',
    'Node.js',
    'SQL',
    'Data Science',
    'Machine Learning',
    'UI/UX',
    'Cybersecurity',
    'Cloud Computing'
  ];

  const handleApplyClick = async (internship: Internship) => {
    if (!currentStudent) {
      onOpenAuth('student', true);
      return;
    }
    const success = await applyForInternship(internship.id);
    if (success) {
      setAppliedNotification(`Successfully applied for ${internship.position} at ${internship.companyName}!`);
      setTimeout(() => setAppliedNotification(null), 4000);
    } else {
      setAppliedNotification(`You have already applied for this position.`);
      setTimeout(() => setAppliedNotification(null), 4000);
    }
  };

  const filteredCourses = selectedSkillFilter === 'All' 
    ? courses 
    : courses.filter(c => c.skill.toLowerCase() === selectedSkillFilter.toLowerCase());

  return (
    <div className="space-y-24 pb-16">
      
      {/* Toast Notification */}
      {appliedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{appliedNotification}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Glowing backdrop elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>The Next-Gen Verified Career Development Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] max-w-5xl mx-auto font-outfit mb-6">
          Learn Skills. <span className="text-gradient">Prove Your Skills.</span> Get Opportunities.
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          Learn through structured courses, verify your skills through assessments and projects, and discover internships that match your abilities.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-6">
          <button
            type="button"
            onClick={() => onOpenAuth('student', false)}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-600 font-semibold rounded-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onOpenAuth('student', true)}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Register
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            type="button"
            onClick={() => setActiveView('courses')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold rounded-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Explore Courses
          </button>

          <button
            type="button"
            onClick={() => setActiveView('internships')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold rounded-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Find Internships
          </button>
        </div>

        {/* Secondary Buttons (For Students & For Companies) */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400">
          <button
            onClick={() => onOpenAuth('student', true)}
            className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" /> For Students
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => onOpenAuth('company', true)}
            className="hover:text-purple-400 transition-colors flex items-center gap-1.5 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800"
          >
            <Building2 className="w-4 h-4 text-purple-400" /> For Companies
          </button>
        </div>

        {/* Key Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 p-6 rounded-2xl glass-panel border border-slate-800">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-white font-outfit">15,000+</p>
            <p className="text-xs text-slate-400">Active Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-indigo-400 font-outfit">850+</p>
            <p className="text-xs text-slate-400">Verified Companies</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-purple-400 font-outfit">94%</p>
            <p className="text-xs text-slate-400">Internship Skill Match</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-emerald-400 font-outfit">100%</p>
            <p className="text-xs text-slate-400">Verified Profiles</p>
          </div>
        </div>

      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            A seamless journey from initial learning to landing your dream internship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Choose a Skill', desc: 'Select from in-demand technologies like Python, React, Data Science, and SQL.', icon: Compass, color: 'from-blue-500 to-indigo-500' },
            { step: '2', title: 'Learn Through Courses', desc: 'Watch high-quality structured video lessons crafted by industry experts.', icon: BookOpen, color: 'from-indigo-500 to-purple-500' },
            { step: '3', title: 'Practice & Take Assessments', desc: 'Solve real-world coding problems and take verified skill quizzes to validate your level.', icon: Award, color: 'from-purple-500 to-pink-500' },
            { step: '4', title: 'Build Your Skill Profile', desc: 'Generate a transparent, tamper-proof skill rating badge backed by performance.', icon: TrendingUp, color: 'from-pink-500 to-rose-500' },
            { step: '5', title: 'Find Matching Internships', desc: 'Our smart algorithm calculates exact skill match % and highlights missing prerequisites.', icon: Zap, color: 'from-emerald-500 to-teal-500' },
            { step: '6', title: 'Apply & Grow', desc: 'Apply with 1-click and get shortlisted directly by verified hiring companies.', icon: Briefcase, color: 'from-cyan-500 to-blue-500' }
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.step} className="glass-panel glass-panel-hover rounded-2xl p-6 relative group overflow-hidden border border-slate-800">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="absolute top-4 right-6 text-4xl font-extrabold text-slate-800 font-outfit select-none group-hover:text-indigo-500/20 transition-colors">
                  0{item.step}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 font-outfit">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR SKILLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white font-outfit mb-2">Popular Skills</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Filter courses & internships by high-demand technical capabilities</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {popularSkills.map(skill => (
            <button
              key={skill}
              onClick={() => setSelectedSkillFilter(skill)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedSkillFilter === skill
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white font-outfit mb-2">Featured Courses</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Master industry tools with top-rated learning modules</p>
          </div>
          <button 
            onClick={() => setActiveView('courses')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.slice(0, 6).map(course => (
            <div key={course.id} className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-semibold text-indigo-300">
                    {course.skill}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {course.rating}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">{course.difficulty}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.studentsCount} students</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 font-outfit line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  <p className="text-xs text-indigo-400 font-medium mb-4">
                    Instructor: {course.instructor}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setActiveCourse(course);
                  }}
                  className="w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Start Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED INTERNSHIPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white font-outfit mb-2">Featured Internships</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Verified opportunities matching student skill levels</p>
          </div>
          <button 
            onClick={() => setActiveView('internships')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Explore All Opportunities <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.slice(0, 4).map(internship => {
            const studentSkills = currentStudent ? currentStudent.skills : { Python: 75, JavaScript: 70, React: 60 };
            const matchInfo = calculateInternshipMatch(studentSkills, internship.requiredSkills);

            return (
              <div key={internship.id} className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={internship.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80'}
                        alt={internship.companyName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-white font-outfit">{internship.position}</h3>
                        <p className="text-xs text-slate-400 font-medium">{internship.companyName}</p>
                      </div>
                    </div>

                    {/* Match Badge */}
                    <div className={`px-3 py-1 rounded-full border text-xs font-extrabold flex items-center gap-1 ${
                      matchInfo.matchPercentage >= 75
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      {matchInfo.matchPercentage}% Match
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {internship.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5 text-purple-400" /> {internship.workMode}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">{internship.stipend}</span>
                  </div>

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
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{internship.postedDate}</span>
                  <button
                    onClick={() => handleApplyClick(internship)}
                    className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY USE OUR PLATFORM SECTION */}
      {/** allow hiding this when LandingPage is reused elsewhere **/}
      {/** default: show */}
      {showWhySection && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
              Why Use Our Platform
            </h2>
            <p className="text-slate-400 text-sm">
              We bridge the gap between traditional learning and modern industry hiring standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Skill-Based Learning', desc: 'Structured learning modules mapped directly to real employer demands.', icon: BookOpen },
              { title: 'Practical Assessments', desc: 'Real-time quiz engines and code evaluations to benchmark your skill rating.', icon: Award },
              { title: 'Project-Based Learning', desc: 'Build portfolio projects that companies verify during recruitment.', icon: Laptop },
              { title: 'Verified Skill Profiles', desc: 'Transparent scores that prove your competency to potential employers.', icon: CheckCircle2 },
              { title: 'Smart Internship Matching', desc: 'Instant calculation of skill match percentages and missing prerequisites.', icon: Zap },
              { title: 'Personalized Recommendations', desc: 'Custom course suggestions engineered to close your skill gaps for target roles.', icon: Sparkles }
            ].map(feature => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-outfit">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

    </div>
  );
};
