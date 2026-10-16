import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, LayoutDashboard, Award, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { InternshipMegaMenu, MegaMenuSelection } from './InternshipMegaMenu';
import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  onOpenAuth: (defaultRole?: 'student' | 'company' | 'admin', isRegister?: boolean) => void;
  activeView: 'landing' | 'dashboard' | 'courses' | 'internships' | 'showcase';
  setActiveView: (view: 'landing' | 'dashboard' | 'courses' | 'internships' | 'showcase') => void;
  onOpenEditProfile: () => void;
  onSelectMegaMenuFilter?: (selection: MegaMenuSelection) => void;
  onOpenGlobalFilter?: () => void;
  onOpenRoadmap?: () => void;
  onOpenResumeBuilder?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenEditProfile,
  activeView,
  setActiveView,
  onSelectMegaMenuFilter,
  onOpenGlobalFilter,
  onOpenRoadmap,
  onOpenResumeBuilder,
}) => {
  const { role } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterInternships = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeaveInternships = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  const handleMegaMenuSelection = (selection: MegaMenuSelection) => {
    setIsMegaMenuOpen(false);
    if (onSelectMegaMenuFilter) {
      onSelectMegaMenuFilter(selection);
    } else {
      setActiveView('internships');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 relative">

            {/* Left section: Hamburger + Brand Logo */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                id="settings-menu-btn"
                onClick={() => setIsSettingsOpen(true)}
                aria-label="Open settings menu"
                className="navbar-hamburger-btn"
              >
                <span className="navbar-hamburger-bar" />
                <span className="navbar-hamburger-bar" />
                <span className="navbar-hamburger-bar" />
              </button>

              <div
                onClick={() => setActiveView('landing')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors duration-200">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-outfit">
                      SkillBridge
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden md:block">Skill-to-Internship Platform</p>
                </div>
              </div>
            </div>

            {/* Center: Global Filter Quick Button */}
            <div className="hidden md:flex items-center flex-1 justify-center gap-3">
              <button
                onClick={onOpenGlobalFilter}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 border bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 hover:shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>Quick Filter</span>
                <span className="text-[10px] bg-white text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                  Courses &amp; Internships
                </span>
              </button>

              <button
                onClick={() => setActiveView('showcase')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 border ${
                  activeView === 'showcase'
                    ? 'bg-amber-50 text-amber-900 border-amber-200 shadow-sm'
                    : 'bg-white hover:bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300 shadow-sm'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Showcase Feed</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Certificates
                </span>
              </button>
            </div>


            {/* Navigation Links & Notification — right section */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <nav className="flex items-center gap-1 bg-white p-1.5 rounded-[16px] border border-slate-200 shadow-sm">
              <button
                onClick={() => setActiveView('landing')}
                className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition-all ${
                  activeView === 'landing' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setActiveView('showcase')}
                className={`lg:hidden px-4 py-2 rounded-[12px] text-sm font-semibold transition-all flex items-center gap-1 ${
                  activeView === 'showcase' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                Showcase
              </button>

              {/* MEGA MENU INTERNSHIPS BUTTON */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnterInternships}
                onMouseLeave={handleMouseLeaveInternships}
              >
                <button
                  onClick={() => setActiveView('internships')}
                  className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    activeView === 'internships' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>Find Internships</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-indigo-500' : 'text-slate-500'}`} />
                </button>
              </div>

              <button
                onClick={() => setActiveView('courses')}
                className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'courses' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Explore Courses</span>
              </button>

              {role !== 'guest' && (
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    activeView === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              )}
              </nav>

              <NotificationBell
                onNavigateInternships={() => setActiveView('internships')}
                onOpenAuth={onOpenAuth}
              />
            </div>

            {/* RENDER MEGA MENU DROPDOWN ANCHORED BELOW HEADER */}
            {isMegaMenuOpen && (
              <div
                onMouseEnter={handleMouseEnterInternships}
                onMouseLeave={handleMouseLeaveInternships}
              >
                <InternshipMegaMenu
                  onSelectOption={handleMegaMenuSelection}
                  onClose={() => setIsMegaMenuOpen(false)}
                />
              </div>
            )}

          </div>
        </div>
      </header>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenEditProfile={onOpenEditProfile}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuth={onOpenAuth}
        onOpenRoadmap={onOpenRoadmap}
        onOpenResumeBuilder={onOpenResumeBuilder}
      />
    </>
  );
};
