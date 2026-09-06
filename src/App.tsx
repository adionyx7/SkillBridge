import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { CompanyDashboard } from './components/CompanyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { QuizModal } from './components/QuizModal';
import { CoursePlayerModal } from './components/CoursePlayerModal';
import { EditProfileModal } from './components/EditProfileModal';
import { UserRole } from './types';

const MainContent: React.FC = () => {
  const { role, activeQuiz, setActiveQuiz, activeCourse, setActiveCourse } = useApp();
  
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'courses' | 'internships'>('landing');

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authRole, setAuthRole] = useState<UserRole>('student');
  const [isRegisterDefault, setIsRegisterDefault] = useState<boolean>(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  const handleOpenAuth = (defaultRole: UserRole = 'student', isRegister: boolean = false) => {
    setAuthRole(defaultRole);
    setIsRegisterDefault(isRegister);
    setIsAuthOpen(true);
  };

  useEffect(() => {
    if (role !== 'guest') {
      setIsAuthOpen(false);
    }
  }, [role]);

  // Auto-open auth modal and show login gate for guests
  useEffect(() => {
    if (role === 'guest') {
      setIsAuthOpen(true);
    }
  }, [role]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      <div>
        <Navbar
          onOpenAuth={handleOpenAuth}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <main className="py-6">
          {/* Login gate: block access until user logs in */}
          {role === 'guest' && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">
              <div className="max-w-xl mx-auto text-center p-8 rounded-2xl bg-slate-900/90 border border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to SkillBridge</h2>
                <p className="text-slate-400 mb-6">Please log in or register to access the platform.</p>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => handleOpenAuth('student', false)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold">Login</button>
                  <button onClick={() => handleOpenAuth('student', true)} className="px-6 py-3 bg-slate-800 text-white rounded-xl border border-slate-700">Register</button>
                </div>
              </div>
            </div>
          )}
          {/* LANDING PAGE VIEW */}
          {activeView === 'landing' && (
            <LandingPage
              onOpenAuth={handleOpenAuth}
              setActiveView={setActiveView}
              showWhySection={true}
            />
          )}

          {/* DASHBOARD VIEW (Switches based on active role!) */}
          {activeView === 'dashboard' && (
            <>
              {role === 'student' && (
                <StudentDashboard
                  onOpenAuth={handleOpenAuth}
                  setActiveView={setActiveView}
                />
              )}
              {role === 'company' && (
                <CompanyDashboard
                  onOpenAuth={handleOpenAuth}
                />
              )}
              {role === 'admin' && (
                <AdminDashboard
                  onOpenAuth={handleOpenAuth}
                />
              )}
              {role === 'guest' && (
                <LandingPage
                  onOpenAuth={handleOpenAuth}
                  setActiveView={setActiveView}
                  showWhySection={false}
                />
              )}
            </>
          )}

          {/* EXPLORE COURSES PAGE */}
          {activeView === 'courses' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-white font-outfit">Explore Skill Verification Courses</h1>
                <p className="text-slate-400 text-sm mt-2">Structured learning modules designed to meet industry requirements and build verified skills</p>
              </div>

              <LandingPage
                onOpenAuth={handleOpenAuth}
                setActiveView={setActiveView}
                showWhySection={false}
              />
            </div>
          )}

          {/* FIND INTERNSHIPS PAGE */}
          {activeView === 'internships' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-white font-outfit">Skill-Matched Internship Portal</h1>
                <p className="text-slate-400 text-sm mt-2">Discover internships matched directly to your verified coding competencies</p>
              </div>

              <LandingPage
                onOpenAuth={handleOpenAuth}
                setActiveView={setActiveView}
                showWhySection={false}
              />
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={authRole}
        isRegisterDefault={isRegisterDefault}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <QuizModal
        quiz={activeQuiz}
        onClose={() => setActiveQuiz(null)}
      />

      <CoursePlayerModal
        course={activeCourse}
        onClose={() => setActiveCourse(null)}
      />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
