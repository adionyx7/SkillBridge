import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { CoursesPage } from './components/CoursesPage';
import { InternshipsPage } from './components/InternshipsPage';
import { ShowcasePage } from './components/ShowcasePage';
import { StudentDashboard } from './components/StudentDashboard';
import { CompanyDashboard } from './components/CompanyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { QuizModal } from './components/QuizModal';
import { CoursePlayerModal } from './components/CoursePlayerModal';
import { EditProfileModal } from './components/EditProfileModal';
import { MegaMenuSelection } from './components/InternshipMegaMenu';
import { GlobalFilterModal } from './components/GlobalFilterModal';
import { RoadmapModal } from './components/RoadmapModal';
import { ResumeBuilderModal } from './components/ResumeBuilderModal';

import { UserRole } from './types';

const MainContent: React.FC = () => {
  const { role, activeQuiz, setActiveQuiz, activeCourse, setActiveCourse } = useApp();
  
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'courses' | 'internships' | 'showcase'>('landing');

  // Mega Menu Filter State
  const [megaFilter, setMegaFilter] = useState<{
    search?: string;
    location?: string;
    skill?: string;
    workMode?: string;
  }>({});

  const handleSelectMegaMenuFilter = (selection: MegaMenuSelection) => {
    let filterObj: { search?: string; location?: string; skill?: string; workMode?: string } = {};

    if (selection.filterType === 'location') {
      if (selection.value === 'Remote') {
        filterObj = { workMode: 'Remote', location: 'All' };
      } else {
        filterObj = { location: selection.value === 'All' ? 'All' : selection.value };
      }
    } else if (selection.filterType === 'profile') {
      filterObj = { search: selection.value };
    } else if (selection.filterType === 'category') {
      filterObj = { search: selection.value === 'All' ? '' : selection.value };
    } else if (selection.filterType === 'explore') {
      filterObj = { search: '' };
    } else if (selection.filterType === 'course') {
      filterObj = { search: selection.value };
    }

    setMegaFilter(filterObj);
    setActiveView('internships');
  };

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authRole, setAuthRole] = useState<UserRole>('student');
  const [isRegisterDefault, setIsRegisterDefault] = useState<boolean>(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isGlobalFilterOpen, setIsGlobalFilterOpen] = useState<boolean>(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState<boolean>(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState<boolean>(false);
  const [roadmapInitialGoal, setRoadmapInitialGoal] = useState<string | null>(null);

  const handleOpenRoadmap = (goal?: string) => {
    setRoadmapInitialGoal(goal || null);
    setIsRoadmapOpen(true);
  };

  const handleOpenAuth = (defaultRole: UserRole = 'student', isRegister: boolean = false) => {
    setAuthRole(defaultRole);
    setIsRegisterDefault(isRegister);
    setIsAuthOpen(true);
  };

  useEffect(() => {
    if (role !== 'guest') {
      setIsAuthOpen(false);
      // Redirect to showcase feed once logged in
      if (activeView === 'landing') setActiveView('showcase');
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
          onSelectMegaMenuFilter={handleSelectMegaMenuFilter}
          onOpenGlobalFilter={() => setIsGlobalFilterOpen(true)}
          onOpenRoadmap={() => handleOpenRoadmap()}
          onOpenResumeBuilder={() => setIsResumeBuilderOpen(true)}
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

          {/* SHOWCASE FEED PAGE VIEW */}
          {activeView === 'showcase' && (
            <ShowcasePage />
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
            <CoursesPage onOpenRoadmap={handleOpenRoadmap} />
          )}

          {/* FIND INTERNSHIPS PAGE */}
          {activeView === 'internships' && (
            <InternshipsPage
              initialSearch={megaFilter.search}
              initialLocation={megaFilter.location}
              initialSkill={megaFilter.skill}
              initialWorkMode={megaFilter.workMode}
            />
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

      <GlobalFilterModal
        isOpen={isGlobalFilterOpen}
        onClose={() => setIsGlobalFilterOpen(false)}
        onSelectCourse={(course) => { setActiveCourse(course); setIsGlobalFilterOpen(false); }}
        onNavigateView={(view) => { setActiveView(view); setIsGlobalFilterOpen(false); }}
      />

      <RoadmapModal
        isOpen={isRoadmapOpen}
        initialGoal={roadmapInitialGoal}
        onClose={() => setIsRoadmapOpen(false)}
        onNavigateCourses={() => { setActiveView('courses'); setIsRoadmapOpen(false); }}
      />

      <ResumeBuilderModal
        isOpen={isResumeBuilderOpen}
        onClose={() => setIsResumeBuilderOpen(false)}
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
