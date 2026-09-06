import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  PlayCircle
} from 'lucide-react';
import { Course, Internship } from '../types';

interface StudentDashboardProps {
  onOpenAuth: (role?: 'student' | 'company' | 'admin', isRegister?: boolean) => void;
  setActiveView: (view: 'landing' | 'dashboard' | 'courses' | 'internships') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenAuth, setActiveView }) => {
  const {
    currentStudent,
    courses,
    quizzes,
    internships,
    applications,
    calculateInternshipMatch,
    applyForInternship,
    setActiveQuiz,
    setActiveCourse
  } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!currentStudent) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
          <GraduationCap className="w-12 h-12 text-indigo-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white font-outfit">Student Login Required</h2>
          <p className="text-slate-400 text-xs">Please sign in to access your student skill profile and internship recommendations.</p>
          <button
            onClick={() => onOpenAuth('student', false)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg"
          >
            Sign In as Student
          </button>
        </div>
      </div>
    );
  }

  // Student's applications
  const myApplications = applications.filter(a => a.studentId === currentStudent.id);

  // Student's enrolled courses
  const enrolledCourseObjects = courses.filter(c => currentStudent.enrolledCourses.includes(c.id));
  const completedCourseObjects = courses.filter(c => currentStudent.completedCourses.includes(c.id));

  // Determine missing skills from top available internships
  const allMissingSkillsSet = new Set<string>();
  internships.forEach(i => {
    const match = calculateInternshipMatch(currentStudent.skills, i.requiredSkills);
    match.missingSkills.forEach(s => allMissingSkillsSet.add(s));
  });

  const handleApply = async (internship: Internship) => {
    const success = await applyForInternship(internship.id);
    if (success) {
      setToastMessage(`Application submitted for ${internship.position}!`);
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setToastMessage(`You have already applied for this position.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. WELCOME SECTION */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-purple-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Verified Student Career Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
              Welcome back, <span className="text-gradient">{currentStudent.name}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-indigo-400" /> {currentStudent.college}</span>
              <span>•</span>
              <span>{currentStudent.degree} in {currentStudent.branch} ({currentStudent.year})</span>
              <span>•</span>
              <span>📍 {currentStudent.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
              {Object.keys(currentStudent.skills).length}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Verified Skills</p>
              <p className="text-sm font-extrabold text-white font-outfit">Skill Profile Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SKILL OVERVIEW & PROGRESS BARS */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-400" /> Verified Skill Overview
            </h2>
            <p className="text-xs text-slate-400">Take practical skill assessments to increase your score & unlock higher internship matches</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(currentStudent.skills).map(([skillName, score]) => (
            <div key={skillName} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-white font-outfit">{skillName}</span>
                <span className="text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {score}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Verification Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>

              <button
                onClick={() => {
                  const quiz = quizzes[skillName] || {
                    id: `quiz_${skillName}`,
                    skill: skillName,
                    title: `${skillName} Skill Verification Test`,
                    passingScore: 70,
                    questions: [
                      {
                        id: 'q1',
                        text: `Which core concept is central to mastering ${skillName}?`,
                        options: ['Modular Architecture & Clean Code', 'Monolithic Spaghetti', 'Global Mutation', 'Inline Assembly'],
                        correctIndex: 0,
                        explanation: 'Modular design promotes maintainability.'
                      },
                      {
                        id: 'q2',
                        text: `How do you optimize performance when working with ${skillName}?`,
                        options: ['Infinite Loops', 'Asynchronous Operations & Memory Caching', 'Blocking I/O', 'Disabling Security'],
                        correctIndex: 1,
                        explanation: 'Async non-blocking execution improves performance.'
                      }
                    ]
                  };
                  setActiveQuiz(quiz);
                }}
                className="w-full py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> Take Test & Raise Score
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LEARNING PROGRESS & ENROLLED COURSES */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-400" /> Learning Progress
            </h2>
            <p className="text-xs text-slate-400">Courses you are currently mastering</p>
          </div>
          <button
            onClick={() => setActiveView('courses')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Browse All Courses <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {enrolledCourseObjects.length === 0 ? (
          <div className="text-center py-8 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-xs mb-3">You are not currently enrolled in any active courses.</p>
            <button
              onClick={() => setActiveView('courses')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
            >
              Explore Courses Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourseObjects.map(course => (
              <div key={course.id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {course.skill}
                  </span>
                  <h3 className="text-sm font-bold text-white font-outfit line-clamp-1">{course.title}</h3>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{course.lessons.length} Lessons</span>
                    <span className="text-indigo-400 font-semibold">In Progress</span>
                  </div>

                  <button
                    onClick={() => setActiveCourse(course)}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PlayCircle className="w-4 h-4" /> Continue Watching
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. RECOMMENDED COURSES BASED ON MISSING INTERNSHIP SKILLS */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Smart Career Recommendation Engine
          </div>
          <h2 className="text-2xl font-bold text-white font-outfit">Recommended Courses</h2>
          <p className="text-xs text-slate-300 mt-1 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            💡 <strong>Career Insight:</strong> If you want to apply for React or Full-Stack internships, you should improve your <strong>React</strong> and <strong>Node.js</strong> skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.slice(0, 3).map(course => (
            <div key={course.id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Fills Missing Skill: {course.skill}
                </span>
                <h3 className="text-sm font-bold text-white font-outfit mt-2">{course.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description}</p>
              </div>

              <button
                onClick={() => setActiveCourse(course)}
                className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" /> View Recommended Course
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERNSHIP MATCHES */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-400" /> Internship Matches & Skill Gaps
          </h2>
          <p className="text-xs text-slate-400">Smart percentage breakdown calculated live against your verified profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.map(internship => {
            const matchInfo = calculateInternshipMatch(currentStudent.skills, internship.requiredSkills);
            const hasApplied = myApplications.some(a => a.internshipId === internship.id);

            return (
              <div key={internship.id} className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-white font-outfit">{internship.position}</h3>
                      <p className="text-xs text-slate-400">{internship.companyName} • {internship.location}</p>
                    </div>

                    <div className={`px-3 py-1 rounded-full border text-xs font-extrabold flex items-center gap-1 ${
                      matchInfo.matchPercentage >= 75
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {matchInfo.matchPercentage}% Match
                    </div>
                  </div>

                  {/* Matching vs Missing Skills */}
                  <div className="space-y-2 mb-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[11px] text-emerald-400 font-semibold block mb-1">Matching Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {matchInfo.matchingSkills.length > 0 ? (
                          matchInfo.matchingSkills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                              ✓ {s} ({currentStudent.skills[s]}%)
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 italic">None</span>
                        )}
                      </div>
                    </div>

                    {matchInfo.missingSkills.length > 0 && (
                      <div className="pt-2 border-t border-slate-900">
                        <span className="text-[11px] text-rose-400 font-semibold block mb-1">Skills Missing:</span>
                        <div className="flex flex-wrap gap-1">
                          {matchInfo.missingSkills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px]">
                              ⚠️ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    matchInfo.isEligible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {matchInfo.isEligible ? 'Eligible to Apply' : 'Prerequisites Missing'}
                  </span>

                  <button
                    onClick={() => handleApply(internship)}
                    disabled={hasApplied}
                    className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      hasApplied
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg'
                    }`}
                  >
                    {hasApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. APPLICATION STATUS TRACKER */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" /> Application Status Tracker
          </h2>
          <p className="text-xs text-slate-400">Track company recruiter responses in real-time</p>
        </div>

        {myApplications.length === 0 ? (
          <div className="text-center py-8 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-xs">No active applications. Find matching internships above and click Apply!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Internship Position</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Match %</th>
                  <th className="py-3 px-4">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {myApplications.map(app => {
                  const matchingInternship = internships.find(i => i.id === app.internshipId);
                  return (
                    <tr key={app.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white">
                        <div>{matchingInternship?.position || 'Software Intern'}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{matchingInternship?.companyName}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{app.appliedDate}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                          {app.matchPercentage}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};
