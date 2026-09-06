import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course, Lesson } from '../types';
import { X, PlayCircle, CheckCircle2, Award, BookOpen, Clock } from 'lucide-react';

interface CoursePlayerModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({ course, onClose }) => {
  const { enrollCourse, completeCourse, setActiveQuiz, quizzes } = useApp();

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(course?.lessons[0] || null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  if (!course) return null;

  const currentLesson = activeLesson || course.lessons[0];

  const handleToggleLessonComplete = (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(completedLessonIds.filter(id => id !== lessonId));
    } else {
      setCompletedLessonIds([...completedLessonIds, lessonId]);
    }
  };

  const isAllLessonsCompleted = completedLessonIds.length === course.lessons.length;

  const handleFinishCourse = () => {
    completeCourse(course.id);
    onClose();
    // Offer quiz for the skill
    const matchingQuiz = quizzes[course.skill];
    if (matchingQuiz) {
      setActiveQuiz(matchingQuiz);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl glass-panel rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
        
        {/* Main Video & Details Panel */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full">
              {course.skill} Course
            </span>
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white font-outfit">{course.title}</h2>
          
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <video
              key={currentLesson.id}
              controls
              autoPlay
              className="w-full h-full object-cover"
              src={currentLesson.videoUrl}
            />
          </div>

          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs text-slate-400 font-medium">Currently Playing Lesson:</p>
              <h3 className="text-base font-bold text-white font-outfit">{currentLesson.title}</h3>
            </div>

            <button
              onClick={() => handleToggleLessonComplete(currentLesson.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                completedLessonIds.includes(currentLesson.id)
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completedLessonIds.includes(currentLesson.id) ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <p className="text-slate-300">{course.description}</p>
            <p className="text-indigo-400 font-medium">Instructor: {course.instructor}</p>
          </div>
        </div>

        {/* Sidebar Lesson Playlist */}
        <div className="w-full lg:w-80 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Course Playlist
              </h3>
              <button
                onClick={onClose}
                className="hidden lg:block text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {course.lessons.map((lesson, idx) => {
                const isActive = lesson.id === currentLesson.id;
                const isDone = completedLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <div>
                        <p className="text-xs font-semibold line-clamp-1">{idx + 1}. {lesson.title}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration}</p>
                      </div>
                    </div>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <button
              onClick={handleFinishCourse}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" /> Complete Course & Take Verification Test
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
