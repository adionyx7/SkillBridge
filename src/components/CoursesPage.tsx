import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Award,
  Clock,
  Users,
  Star,
  Filter,
  Search,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
interface CoursesPageProps {
  onOpenRoadmap?: (goal?: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onOpenRoadmap }) => {
  const { courses, currentStudent, setActiveCourse, enrollCourse } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [selectedEnrollmentStatus, setSelectedEnrollmentStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('popular');

  const categories = ['All', 'Web Development', 'Data Science & AI', 'Cloud & DevOps', 'Cybersecurity', 'UI/UX Design', 'Programming Languages'];
  const allSkills = ['All', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Data Science', 'Machine Learning', 'UI/UX', 'Cybersecurity', 'Cloud Computing', 'Java', 'TypeScript', 'Docker', 'AWS'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const durations = ['All', 'Short (< 5 hrs)', 'Medium (5-15 hrs)', 'In-depth (15+ hrs)'];
  const enrollmentStatuses = ['All', 'Enrolled', 'Completed', 'Not Started'];

  // Helper to parse duration string in hours
  const parseDurationHours = (durationStr: string): number => {
    if (!durationStr) return 0;
    const match = durationStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = selectedSkill === 'All' || course.skill.toLowerCase().includes(selectedSkill.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;

    let matchesCategory = true;
    if (selectedCategory === 'Web Development') matchesCategory = course.skill.includes('React') || course.skill.includes('JavaScript') || course.skill.includes('Node.js');
    else if (selectedCategory === 'Data Science & AI') matchesCategory = course.skill.includes('Data Science') || course.skill.includes('Machine Learning') || course.skill.includes('Python');
    else if (selectedCategory === 'Cloud & DevOps') matchesCategory = course.skill.includes('Cloud') || course.skill.includes('Docker') || course.skill.includes('AWS');
    else if (selectedCategory === 'Cybersecurity') matchesCategory = course.skill.includes('Cybersecurity');
    else if (selectedCategory === 'UI/UX Design') matchesCategory = course.skill.includes('UI/UX');
    else if (selectedCategory === 'Programming Languages') matchesCategory = course.skill.includes('Python') || course.skill.includes('Java') || course.skill.includes('TypeScript') || course.skill.includes('JavaScript');

    let matchesDuration = true;
    const hours = parseDurationHours(course.duration);
    if (selectedDuration === 'Short (< 5 hrs)') matchesDuration = hours < 5;
    else if (selectedDuration === 'Medium (5-15 hrs)') matchesDuration = hours >= 5 && hours <= 15;
    else if (selectedDuration === 'In-depth (15+ hrs)') matchesDuration = hours > 15;

    let matchesEnrollment = true;
    if (currentStudent && selectedEnrollmentStatus !== 'All') {
      const isEnrolled = currentStudent.enrolledCourses.includes(course.id);
      const isCompleted = currentStudent.completedCourses.includes(course.id);
      if (selectedEnrollmentStatus === 'Enrolled') matchesEnrollment = isEnrolled && !isCompleted;
      else if (selectedEnrollmentStatus === 'Completed') matchesEnrollment = isCompleted;
      else if (selectedEnrollmentStatus === 'Not Started') matchesEnrollment = !isEnrolled && !isCompleted;
    }

    return matchesSearch && matchesSkill && matchesDifficulty && matchesCategory && matchesDuration && matchesEnrollment;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.studentsCount - a.studentsCount;
      case 'rating': return b.rating - a.rating;
      case 'newest': return 0;
      case 'duration': return parseDurationHours(a.duration) - parseDurationHours(b.duration);
      default: return 0;
    }
  });

  const isEnrolled = (courseId: string) => currentStudent?.enrolledCourses.includes(courseId) ?? false;
  const isCompleted = (courseId: string) => currentStudent?.completedCourses.includes(courseId) ?? false;

  const resetAllFilters = () => {
    setSelectedSkill('All');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedDuration('All');
    setSelectedEnrollmentStatus('All');
    setSearchQuery('');
  };

  const hasFiltersActive = selectedSkill !== 'All' || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedDuration !== 'All' || selectedEnrollmentStatus !== 'All' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Page Header */}
      <header className="relative pt-16 lg:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Verified Skill Development Courses</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-outfit leading-tight">
                Explore <span className="text-gradient">Courses</span>
              </h1>
              <p className="text-slate-300 text-sm mt-1">Master in-demand skills with industry experts</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Structured learning modules with hands-on projects, verified assessments, and skill badges that prove your competency to employers.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 rounded-2xl glass-panel border border-slate-800">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">{courses.length}</p>
              <p className="text-xs text-slate-400">Total Courses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-outfit">{courses.filter(c => c.difficulty === 'Beginner').length}</p>
              <p className="text-xs text-slate-400">Beginner Friendly</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-outfit">{courses.filter(c => c.difficulty === 'Advanced').length}</p>
              <p className="text-xs text-slate-400">Advanced Courses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-outfit">{currentStudent?.enrolledCourses.length || 0}</p>
              <p className="text-xs text-slate-400">Your Enrollments</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters & Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-5">

          
          {/* Top Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              placeholder="Search courses by title, skill, instructor, or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Pills Bar */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Quick Filter Topics:
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { label: '⚡ All Courses', type: 'all' },
                { label: '🌐 Web Dev', type: 'category', value: 'Web Development' },
                { label: '🐍 Python', type: 'skill', value: 'Python' },
                { label: '⚛️ React', type: 'skill', value: 'React' },
                { label: '📊 Data Science', type: 'skill', value: 'Data Science' },
                { label: '🤖 AI / ML', type: 'category', value: 'Data Science & AI' },
                { label: '🎨 UI/UX', type: 'skill', value: 'UI/UX' },
                { label: '☁️ Cloud & DevOps', type: 'category', value: 'Cloud & DevOps' },
                { label: '🌱 Beginner', type: 'difficulty', value: 'Beginner' },
                { label: '🔥 Advanced', type: 'difficulty', value: 'Advanced' },
                { label: '⏱️ Short Courses', type: 'duration', value: 'Short (< 5 hrs)' },
              ].map((pill, idx) => {
                const isSelected =
                  pill.type === 'all'
                    ? selectedSkill === 'All' && selectedDifficulty === 'All' && selectedCategory === 'All' && selectedDuration === 'All' && !searchQuery
                    : pill.type === 'skill'
                    ? selectedSkill === pill.value
                    : pill.type === 'category'
                    ? selectedCategory === pill.value
                    : pill.type === 'duration'
                    ? selectedDuration === pill.value
                    : selectedDifficulty === pill.value;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (pill.type === 'all') {
                        resetAllFilters();
                      } else if (pill.type === 'skill') {
                        setSelectedSkill(selectedSkill === pill.value ? 'All' : pill.value!);
                      } else if (pill.type === 'category') {
                        setSelectedCategory(selectedCategory === pill.value ? 'All' : pill.value!);
                      } else if (pill.type === 'difficulty') {
                        setSelectedDifficulty(selectedDifficulty === pill.value ? 'All' : pill.value!);
                      } else if (pill.type === 'duration') {
                        setSelectedDuration(selectedDuration === pill.value ? 'All' : pill.value!);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 scale-105'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multi-Dropdown Filter Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Domain</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Skill</label>
              <select
                value={selectedSkill}
                onChange={e => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {allSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Level</label>
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {difficulties.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Duration</label>
              <select
                value={selectedDuration}
                onChange={e => setSelectedDuration(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {durations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {currentStudent && (
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">My Progress</label>
                <select
                  value={selectedEnrollmentStatus}
                  onChange={e => setSelectedEnrollmentStatus(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {enrollmentStatuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col justify-end">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="duration">Shortest First</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges & Reset */}
          {hasFiltersActive && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1"><Filter className="w-3 h-3" /> Active:</span>
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                  🔍 "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-white font-bold ml-0.5">✕</button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                  Domain: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-white font-bold ml-0.5">✕</button>
                </span>
              )}
              {selectedSkill !== 'All' && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                  Skill: {selectedSkill}
                  <button onClick={() => setSelectedSkill('All')} className="hover:text-white font-bold ml-0.5">✕</button>
                </span>
              )}
              {selectedDifficulty !== 'All' && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                  Level: {selectedDifficulty}
                  <button onClick={() => setSelectedDifficulty('All')} className="hover:text-white font-bold ml-0.5">✕</button>
                </span>
              )}
              {selectedDuration !== 'All' && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                  Duration: {selectedDuration}
                  <button onClick={() => setSelectedDuration('All')} className="hover:text-white font-bold ml-0.5">✕</button>
                </span>
              )}
              {selectedEnrollmentStatus !== 'All' && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                  Status: {selectedEnrollmentStatus}
                  <button onClick={() => setSelectedEnrollmentStatus('All')} className="hover:text-white font-bold ml-0.5">✕</button>
                </span>
              )}
              <button
                onClick={resetAllFilters}
                className="ml-auto px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold transition-all"
              >
                Reset All ✕
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-white font-outfit">
            {hasFiltersActive ? `Filtered Results` : 'All Courses'} <span className="text-indigo-400">({sortedCourses.length})</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>{courses.length} courses across {new Set(courses.map(c => c.skill)).size} skills</span>
          </div>
        </div>

        {sortedCourses.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-slate-400">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map(course => {
              const enrolled = isEnrolled(course.id);
              const completed = isCompleted(course.id);
              const progress = currentStudent ? 
                Math.round((Object.values(currentStudent.quizScores || {}).filter((s: number) => s >= 70).length / Math.max(1, course.skill ? 1 : 1)) * 100) : 0;

              return (
                <div key={course.id} className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between group">
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex justify-between">
                        <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-semibold text-indigo-300">
                          {course.skill}
                        </span>
                        <span className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {course.rating}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-medium text-white flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {course.duration}
                        </span>
                        <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-medium text-white flex items-center gap-1">
                          <Users className="w-3 h-3" /> {course.studentsCount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                        <span className={`px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium ${
                          course.difficulty === 'Beginner' ? 'text-emerald-400' :
                          course.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 font-outfit line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-xs mb-4">
                        <span className="text-indigo-400 font-medium flex items-center gap-1">
                          Instructor: {course.instructor}
                        </span>
                        {currentStudent && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                            completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            enrolled ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {completed ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                              </>
                            ) : enrolled ? (
                              <>
                                <Sparkles className="w-3 h-3" />
                                Enrolled
                              </>
                            ) : (
                              'Not Started'
                            )}
                          </span>
                        )}
                      </div>

                      {/* Skills you'll learn */}
                      <div className="mb-4">
                        <p className="text-[11px] text-slate-400 mb-2 font-medium">Skills you'll learn:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {course.skill.split(', ').slice(0, 4).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-medium">
                              {skill}
                            </span>
                          ))}
                          {course.skill.split(', ').length > 4 && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-medium">
                              +{course.skill.split(', ').length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    {currentStudent ? (
                      completed ? (
                        <button
                          onClick={() => setActiveCourse(course)}
                          className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <Award className="w-4 h-4" /> Review Course
                        </button>
                      ) : enrolled ? (
                        <button
                          onClick={() => setActiveCourse(course)}
                          className="w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <BookOpen className="w-4 h-4" /> Continue Learning
                        </button>
                      ) : (
                        <button
                          onClick={() => enrollCourse(course.id)}
                          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" /> Enroll Free
                        </button>
                      )
                    ) : (
                      <button
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                        onClick={() => alert('Please login to enroll in courses')}
                      >
                        <GraduationCap className="w-4 h-4" /> Login to Enroll
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Learning Path Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
            Recommended Learning Paths
          </h2>
          <p className="text-slate-400 text-sm">
            Curated course sequences to build complete skill sets for in-demand roles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Full-Stack Web Developer',
              courses: ['React Fundamentals', 'Node.js Backend', 'Database Design', 'Deployment'],
              icon: BookOpen,
              color: 'from-indigo-500 to-purple-500',
              duration: '12 weeks',
              level: 'Beginner to Advanced'
            },
            {
              title: 'Data Science Specialist',
              courses: ['Python for Data', 'SQL Analytics', 'Machine Learning', 'Data Visualization'],
              icon: TrendingUp,
              color: 'from-emerald-500 to-teal-500',
              duration: '16 weeks',
              level: 'Intermediate'
            },
            {
              title: 'Cloud & DevOps Engineer',
              courses: ['Docker & Containers', 'AWS Fundamentals', 'CI/CD Pipelines', 'Kubernetes'],
              icon: Sparkles,
              color: 'from-cyan-500 to-blue-500',
              duration: '14 weeks',
              level: 'Intermediate to Advanced'
            }
          ].map((path, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-6 border border-slate-800 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center text-white mb-4`}>
                <path.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-outfit">{path.title}</h3>
              <p className="text-xs text-slate-400 mb-4">{path.level} • {path.duration}</p>
              <div className="space-y-2 mb-4">
                {path.courses.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-medium flex-shrink-0">{i + 1}</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => onOpenRoadmap?.()}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-semibold text-white transition-all roadmap-reset-btn"
              >
                View Path
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};