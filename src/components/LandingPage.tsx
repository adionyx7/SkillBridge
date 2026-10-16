import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  Briefcase,
  TrendingUp,
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
      setAppliedNotification(`Applied for ${internship.position} at ${internship.companyName}.`);
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
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{appliedNotification}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-semibold mb-8 mx-auto">
          <span>Skill-Verified Career Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-5xl mx-auto font-outfit mb-6">
          Learn a skill. Verify it.<br/>Find internships that fit.
        </h1>

        <p className="text-base sm:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          Structured courses, skill assessments, and a smart matching engine that connects students to internships based on actual competency — not résumé keywords.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-6">
          <button
            type="button"
            onClick={() => onOpenAuth('student', false)}
            className="w-full sm:w-auto px-10 py-3 bg-white text-slate-800 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm font-semibold rounded-[14px] transition-all flex items-center justify-center"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onOpenAuth('student', true)}
            className="w-full sm:w-auto px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold rounded-[14px] transition-all flex items-center justify-center"
          >
            Register
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            type="button"
            onClick={() => setActiveView('courses')}
            className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2"
          >
            Explore Courses
          </button>

          <button
            type="button"
            onClick={() => setActiveView('internships')}
            className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2"
          >
            Find Internships
          </button>
        </div>

        {/* Secondary Buttons */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500">
          <button
            onClick={() => onOpenAuth('student', true)}
            className="hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl border border-slate-200 bg-white hover:border-indigo-200"
          >
            For Students
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => onOpenAuth('company', true)}
            className="hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl border border-slate-200 bg-white hover:border-indigo-200"
          >
            For Companies
          </button>
        </div>

        {/* Key Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 p-6 rounded-2xl glass-panel border border-slate-200">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-slate-900 font-outfit">15,000+</p>
            <p className="text-xs text-slate-500">Active Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-indigo-600 font-outfit">850+</p>
            <p className="text-xs text-slate-500">Verified Companies</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-slate-900 font-outfit">94%</p>
            <p className="text-xs text-slate-500">Internship Skill Match</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-emerald-600 font-outfit">100%</p>
            <p className="text-xs text-slate-500">Verified Profiles</p>
          </div>
        </div>

      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-4">
            How It Works
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            A clear path from learning to landing your first role
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Choose a Skill', desc: 'Select from in-demand technologies like Python, React, Data Science, and SQL.', icon: Compass },
            { step: '2', title: 'Learn Through Courses', desc: 'Watch structured video lessons built by industry practitioners.', icon: BookOpen },
            { step: '3', title: 'Take Assessments', desc: 'Solve real-world coding problems and verified quizzes to benchmark your level.', icon: Award },
            { step: '4', title: 'Build Your Skill Profile', desc: 'Generate a tamper-proof skill rating backed by assessment performance.', icon: TrendingUp },
            { step: '5', title: 'Find Matching Internships', desc: 'Our algorithm calculates exact skill match percentages and surfaces missing skills.', icon: Zap },
            { step: '6', title: 'Apply and Grow', desc: 'Apply directly to verified hiring companies with a single click.', icon: Briefcase }
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.step} className="glass-panel glass-panel-hover rounded-2xl p-6 relative group overflow-hidden border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="absolute top-4 right-6 text-4xl font-extrabold text-slate-100 font-outfit select-none">
                  0{item.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-outfit">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR SKILLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit mb-2">Popular Skills</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Filter courses and internships by high-demand technical capabilities</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {popularSkills.map(skill => (
            <button
              key={skill}
              onClick={() => setSelectedSkillFilter(skill)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedSkillFilter === skill
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
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
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit mb-2">Featured Courses</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Master industry tools with top-rated learning modules</p>
          </div>
          <button 
            onClick={() => setActiveView('courses')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.slice(0, 6).map(course => (
            <div key={course.id} className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between">
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md border border-slate-200 text-[11px] font-semibold text-slate-700">
                    {course.skill}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-semibold text-amber-600">
                    {course.rating}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{course.difficulty}</span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.studentsCount}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 font-outfit line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  <p className="text-xs text-indigo-600 font-medium mb-4">
                    Instructor: {course.instructor}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setActiveCourse(course);
                  }}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  Start Course
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
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit mb-2">Featured Internships</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Verified opportunities matched to student skill levels</p>
          </div>
          <button 
            onClick={() => setActiveView('internships')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Explore All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.slice(0, 4).map(internship => {
            const studentSkills = currentStudent ? currentStudent.skills : { Python: 75, JavaScript: 70, React: 60 };
            const matchInfo = calculateInternshipMatch(studentSkills, internship.requiredSkills);

            return (
              <div key={internship.id} className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={internship.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80'}
                        alt={internship.companyName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 font-outfit">{internship.position}</h3>
                        <p className="text-xs text-slate-500 font-medium">{internship.companyName}</p>
                      </div>
                    </div>

                    {/* Match Badge */}
                    <div className={`px-3 py-1 rounded-md border text-xs font-bold ${
                      matchInfo.matchPercentage >= 75
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {matchInfo.matchPercentage}% Match
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {internship.location}</span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5 text-slate-400" /> {internship.workMode}</span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">{internship.stipend}</span>
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
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-slate-100 border-slate-200 text-slate-500'
                            }`}
                          >
                            {isMatched && <Check className="w-3 h-3 text-emerald-500" />}
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{internship.postedDate}</span>
                  <button
                    onClick={() => handleApplyClick(internship)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all"
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
      {showWhySection && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200 relative overflow-hidden">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-4">
              Why SkillBridge
            </h2>
            <p className="text-slate-500 text-sm">
              We close the gap between what students learn and what companies actually need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Skill-Based Learning', desc: 'Learning modules mapped directly to real employer demands.', icon: BookOpen },
              { title: 'Practical Assessments', desc: 'Quiz engines and code evaluations to benchmark your skill rating.', icon: Award },
              { title: 'Project-Based Learning', desc: 'Build portfolio projects that companies verify during recruitment.', icon: Laptop },
              { title: 'Verified Skill Profiles', desc: 'Transparent scores that prove your competency to potential employers.', icon: CheckCircle2 },
              { title: 'Smart Internship Matching', desc: 'Instant calculation of skill match percentages and missing prerequisites.', icon: Zap },
              { title: 'Personalised Recommendations', desc: 'Course suggestions that close your skill gaps for target roles.', icon: TrendingUp }
            ].map(feature => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-outfit">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
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
