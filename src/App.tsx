import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { CoursesPage } from './components/CoursesPage';
import { InternshipsPage } from './components/InternshipsPage';
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
            </>
          )}

          {/* EXPLORE COURSES PAGE */}
          {activeView === 'courses' && (
            <CoursesPage />
          )}

          {/* FIND INTERNSHIPS PAGE */}
          {activeView === 'internships' && (
            <InternshipsPage />
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
