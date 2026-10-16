import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Building2,
  Shield,
  Edit3,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Home,
  Mail,
  MapPin,
  GraduationCap,
  Globe,
  BadgeCheck,
  Settings,
  Target,
  FileText,
  ChevronRight,
} from 'lucide-react';

import { Award } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditProfile: () => void;
  activeView: 'landing' | 'dashboard' | 'courses' | 'internships' | 'showcase';
  setActiveView: (view: 'landing' | 'dashboard' | 'courses' | 'internships' | 'showcase') => void;
  onOpenAuth: (defaultRole?: 'student' | 'company' | 'admin', isRegister?: boolean) => void;
  onOpenRoadmap?: () => void;
  onOpenResumeBuilder?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  onOpenEditProfile,
  activeView,
  setActiveView,
  onOpenAuth,
  onOpenRoadmap,
  onOpenResumeBuilder,
}) => {
  const { role, currentStudent, currentCompany, logout } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navigate = (view: 'landing' | 'dashboard' | 'courses' | 'internships' | 'showcase') => {
    setActiveView(view);
    onClose();
  };

  const handleEditProfile = () => {
    onOpenEditProfile();
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Avatar letter
  const avatarLetter =
    role === 'student' ? (currentStudent?.name.charAt(0).toUpperCase() || 'S') :
    role === 'company' ? (currentCompany?.companyName.charAt(0).toUpperCase() || 'C') :
    role === 'admin' ? 'A' : '?';

  const displayName =
    role === 'student' ? currentStudent?.name :
    role === 'company' ? currentCompany?.companyName :
    role === 'admin' ? 'System Admin' : 'Guest';

  const displayEmail =
    role === 'student' ? currentStudent?.email :
    role === 'company' ? currentCompany?.email :
    role === 'admin' ? 'admin@skillbridge.com' : '';

  const roleLabel =
    role === 'student' ? 'Student Account' :
    role === 'company' ? (currentCompany?.isVerified ? '✓ Verified Employer' : 'Employer · Pending') :
    role === 'admin' ? 'Administrator' : '';

  const navItems = [
    { icon: Home, label: 'Home', view: 'landing' as const },
    { icon: Award, label: 'Showcase Feed', view: 'showcase' as const },
    { icon: BookOpen, label: 'Explore Courses', view: 'courses' as const },
    { icon: Briefcase, label: 'Find Internships', view: 'internships' as const },
    ...(role !== 'guest' ? [{ icon: LayoutDashboard, label: 'My Dashboard', view: 'dashboard' as const }] : []),
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`settings-backdrop ${isOpen ? 'settings-backdrop--visible' : ''}`}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        id="settings-panel"
        className={`settings-panel ${isOpen ? 'settings-panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Settings & Account"
      >
        {/* Header */}
        <div className="settings-panel__header">
          <div className="settings-panel__header-title">
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Settings & Account</span>
          </div>
          <button
            onClick={onClose}
            className="settings-panel__close-btn"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="settings-panel__body">
          {/* ── Profile Card ── */}
          {role !== 'guest' ? (
            <div className="settings-profile-card">
              {/* Avatar */}
              <div className="settings-avatar">
                {role === 'student' && <User className="settings-avatar__role-icon" />}
                {role === 'company' && <Building2 className="settings-avatar__role-icon" />}
                {role === 'admin' && <Shield className="settings-avatar__role-icon" />}
                <span className="settings-avatar__letter">{avatarLetter}</span>
              </div>

              {/* Info */}
              <div className="settings-profile-card__info">
                <p className="settings-profile-card__name">{displayName}</p>
                <span className="settings-profile-card__role-badge">
                  {role === 'student' && <GraduationCap className="w-3 h-3" />}
                  {role === 'company' && <BadgeCheck className="w-3 h-3" />}
                  {role === 'admin' && <Shield className="w-3 h-3" />}
                  {roleLabel}
                </span>
              </div>

              {/* Details */}
              <div className="settings-profile-details">
                {displayEmail && (
                  <div className="settings-detail-row">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{displayEmail}</span>
                  </div>
                )}
                {role === 'student' && currentStudent?.location && (
                  <div className="settings-detail-row">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentStudent.location}</span>
                  </div>
                )}
                {role === 'student' && currentStudent?.college && (
                  <div className="settings-detail-row">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentStudent.college} · {currentStudent.year}</span>
                  </div>
                )}
                {role === 'company' && currentCompany?.location && (
                  <div className="settings-detail-row">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentCompany.location}</span>
                  </div>
                )}
                {role === 'company' && currentCompany?.website && (
                  <div className="settings-detail-row">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentCompany.website}</span>
                  </div>
                )}
              </div>

              {/* Edit Profile CTA */}
              {(role === 'student' || role === 'company') && (
                <button
                  id="settings-edit-profile-btn"
                  onClick={handleEditProfile}
                  className="settings-edit-btn"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>
          ) : (
            /* Guest State */
            <div className="settings-guest-card">
              <div className="settings-guest-card__icon">
                <User className="w-8 h-8 text-slate-500" />
              </div>
              <p className="settings-guest-card__title">Not signed in</p>
              <p className="settings-guest-card__subtitle">Sign in to access your account and profile settings.</p>
              <div className="settings-guest-card__actions">
                <button
                  id="settings-login-btn"
                  onClick={() => { onOpenAuth('student', false); onClose(); }}
                  className="settings-btn settings-btn--outline"
                >
                  Log In
                </button>
                <button
                  id="settings-register-btn"
                  onClick={() => { onOpenAuth('student', true); onClose(); }}
                  className="settings-btn settings-btn--primary"
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="settings-section">
            <p className="settings-section__label">Navigation</p>
            <nav className="settings-nav">
              {navItems.map(({ icon: Icon, label, view }) => (
                <button
                  key={view}
                  id={`settings-nav-${view}`}
                  onClick={() => navigate(view)}
                  className={`settings-nav-item ${activeView === view ? 'settings-nav-item--active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                </button>
              ))}
            </nav>
          </div>

          {/* ── Goals & Roadmap ── */}
          <div className="settings-section">
            <p className="settings-section__label">Goals &amp; Career Path</p>
            <div className="settings-nav">
              <button
                id="settings-roadmap-btn"
                onClick={() => {
                  if (onOpenRoadmap) onOpenRoadmap();
                  onClose();
                }}
                className="settings-nav-item settings-nav-item--roadmap"
              >
                <Target className="w-4 h-4" />
                <span>AIM &amp; Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
              </button>
              
              <button
                id="settings-resume-btn"
                onClick={() => {
                  if (onOpenResumeBuilder) onOpenResumeBuilder();
                  onClose();
                }}
                className="settings-nav-item settings-nav-item--roadmap"
                style={{ marginTop: '4px', background: 'rgba(56, 189, 248, 0.06)', borderColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
              >
                <FileText className="w-4 h-4" />
                <span>Resume Builder</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
              </button>
            </div>
            {role === 'guest' && (
              <p className="settings-roadmap-guest-hint">
                Set your career goal and get a personalised roadmap. Log in for skill-matched insights.
              </p>
            )}
          </div>

          {/* ── Account Actions ── */}
          {role !== 'guest' && (
            <div className="settings-section">
              <p className="settings-section__label">Account</p>
              <div className="settings-nav">
                <button
                  id="settings-logout-btn"
                  onClick={handleLogout}
                  className="settings-nav-item settings-nav-item--danger"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="settings-panel__footer">
          <span>SkillBridge</span>
          <span className="settings-panel__footer-dot">·</span>
          <span>Skill-to-Internship Ecosystem</span>
        </div>
      </div>
    </>
  );
};
