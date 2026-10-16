import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, BellRing, Briefcase, X, ChevronRight, Zap, CheckCheck, Clock, LogIn, Lock, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Internship } from '../types';

const LAST_SEEN_KEY = 'skillbridge_notif_last_seen';
const MIN_MATCH = 65;

interface MatchedInternship {
  internship: Internship;
  matchPercentage: number;
  matchingSkills: string[];
  isNew: boolean;
}

interface NotificationBellProps {
  onNavigateInternships: () => void;
  onOpenAuth?: (role?: 'student' | 'company' | 'admin', isRegister?: boolean) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onNavigateInternships,
  onOpenAuth,
}) => {
  const { role, currentStudent, internships, calculateInternshipMatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<number>(() => {
    const stored = localStorage.getItem(LAST_SEEN_KEY);
    return stored ? parseInt(stored, 10) : Date.now() - 7 * 24 * 60 * 60 * 1000;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const isStudent = role === 'student';

  const matchedInternships: MatchedInternship[] = React.useMemo(() => {
    if (!currentStudent || !isStudent) return [];
    return internships
      .map(internship => {
        const result = calculateInternshipMatch(currentStudent.skills, internship.requiredSkills);
        if (result.matchPercentage < MIN_MATCH) return null;
        const postedTs = new Date(internship.postedDate).getTime();
        const isNew = !isNaN(postedTs) ? postedTs > lastSeen : false;
        return {
          internship,
          matchPercentage: result.matchPercentage,
          matchingSkills: result.matchingSkills,
          isNew,
        } as MatchedInternship;
      })
      .filter(Boolean) as MatchedInternship[];
  }, [internships, currentStudent, isStudent, calculateInternshipMatch, lastSeen]);

  const newCount = matchedInternships.filter(m => m.isNew).length;
  const totalCount = matchedInternships.length;

  const markAllRead = useCallback(() => {
    const now = Date.now();
    setLastSeen(now);
    localStorage.setItem(LAST_SEEN_KEY, String(now));
  }, []);

  const handleViewAll = () => {
    markAllRead();
    setIsOpen(false);
    onNavigateInternships();
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const matchColor = (pct: number) =>
    pct >= 85 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#6366f1';

  // Badge count: for guests show a static "!" to hint at locked content
  const showBadge = isStudent ? newCount > 0 : true;
  const badgeLabel = isStudent ? (newCount > 9 ? '9+' : String(newCount)) : '!';

  return (
    <div className="notif-bell-wrapper" style={{ gap: '0.5rem' }}>
      
      {/* ── STREAK BUTTON ── */}
      <div 
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 shadow-sm cursor-help group" 
        title={isStudent && currentStudent ? `Active Streak: ${currentStudent.streak} Days` : 'Login to start your learning streak!'}
      >
        <Flame className={`w-4 h-4 ${isStudent && currentStudent && currentStudent.streak > 0 ? 'text-amber-500' : 'text-slate-400 group-hover:text-amber-400 transition-colors'}`} />
        <span className={`text-xs font-bold ${isStudent && currentStudent && currentStudent.streak > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
          {isStudent && currentStudent ? currentStudent.streak : 0}
        </span>
      </div>

      <button
        ref={bellRef}
        id="notification-bell-btn"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isStudent ? `Notifications — ${newCount} new` : 'Notifications — Login to unlock'}
        className={`notif-bell-btn ${isOpen ? 'notif-bell-btn--active' : ''}`}
      >
        {isStudent && newCount > 0 ? (
          <BellRing className="w-5 h-5 notif-bell-icon notif-bell-icon--ringing" />
        ) : (
          <Bell className="w-5 h-5 notif-bell-icon" />
        )}
        {showBadge && (
          <span
            className={`notif-badge ${!isStudent ? 'notif-badge--locked' : ''}`}
            aria-label={isStudent ? `${newCount} new notifications` : 'Login required'}
          >
            {badgeLabel}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div ref={dropdownRef} className="notif-dropdown" role="dialog" aria-label="Notifications">

          {/* ── LOCKED STATE (Guest / non-student) ── */}
          {!isStudent ? (
            <>
              {/* Header */}
              <div className="notif-dropdown__header">
                <div className="notif-dropdown__header-left">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <span>Notifications</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="notif-close-btn" aria-label="Close">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Locked body */}
              <div className="notif-locked-body">
                <div className="notif-locked-icon">
                  <Lock className="w-7 h-7 text-indigo-400" />
                </div>
                <p className="notif-locked-title">Personalised Alerts Locked</p>
                <p className="notif-locked-desc">
                  Log in as a <strong>Student</strong> to get real-time internship matches
                  tailored to your skill set — right here in this panel.
                </p>

                {/* Preview chips */}
                <div className="notif-locked-preview">
                  {['React', 'Python', 'Machine Learning', 'UI/UX Design', 'Node.js'].map(skill => (
                    <span key={skill} className="notif-locked-chip">{skill}</span>
                  ))}
                </div>

                <p className="notif-locked-hint">
                  🔔 Be the first to know about skill-matched openings
                </p>

                <button
                  className="notif-locked-login-btn"
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenAuth) onOpenAuth('student', false);
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  Log in as Student
                </button>

                <button
                  className="notif-locked-register-btn"
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenAuth) onOpenAuth('student', true);
                  }}
                >
                  Create a Free Account
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ── STUDENT STATE ── */}
              {/* Header */}
              <div className="notif-dropdown__header">
                <div className="notif-dropdown__header-left">
                  <BellRing className="w-4 h-4 text-indigo-400" />
                  <span>Matched Internships</span>
                  {totalCount > 0 && (
                    <span className="notif-count-pill">{totalCount} matches</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {newCount > 0 && (
                    <button onClick={markAllRead} className="notif-mark-read-btn" title="Mark all as read">
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="notif-close-btn" aria-label="Close">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Skill summary strip */}
              {currentStudent && (
                <div className="notif-skill-strip">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>
                    Showing internships matching your top skills:{' '}
                    <strong>
                      {Object.entries(currentStudent.skills)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([s]) => s)
                        .join(', ')}
                    </strong>
                  </span>
                </div>
              )}

              {/* List */}
              <div className="notif-list">
                {matchedInternships.length === 0 ? (
                  <div className="notif-empty">
                    <Briefcase className="w-8 h-8 text-slate-600 mb-2" />
                    <p>No matching internships yet.</p>
                    <span>Add more skills to your profile to unlock matches!</span>
                  </div>
                ) : (
                  matchedInternships.map(({ internship, matchPercentage, matchingSkills, isNew }) => (
                    <button
                      key={internship.id}
                      className={`notif-item ${isNew ? 'notif-item--new' : ''}`}
                      onClick={() => {
                        markAllRead();
                        setIsOpen(false);
                        onNavigateInternships();
                      }}
                    >
                      {/* Company Avatar */}
                      <div className="notif-item__avatar">
                        {internship.companyLogo ? (
                          <img src={internship.companyLogo} alt={internship.companyName} className="w-full h-full object-contain rounded-lg" />
                        ) : (
                          <span className="notif-item__avatar-letter">
                            {internship.companyName.charAt(0)}
                          </span>
                        )}
                        {isNew && <span className="notif-item__new-dot" />}
                      </div>

                      {/* Content */}
                      <div className="notif-item__content">
                        <div className="notif-item__title-row">
                          <span className="notif-item__position">{internship.position}</span>
                          <span
                            className="notif-item__match-pct"
                            style={{ color: matchColor(matchPercentage) }}
                          >
                            {matchPercentage}%
                          </span>
                        </div>
                        <span className="notif-item__company">{internship.companyName}</span>
                        <div className="notif-item__meta">
                          <span className="notif-item__pill">{internship.workMode}</span>
                          <span className="notif-item__pill">{internship.stipend}</span>
                          {internship.location !== 'Remote' && (
                            <span className="notif-item__pill">{internship.location}</span>
                          )}
                        </div>
                        {matchingSkills.length > 0 && (
                          <div className="notif-item__skills">
                            {matchingSkills.slice(0, 3).map(s => (
                              <span key={s} className="notif-item__skill-tag">{s}</span>
                            ))}
                            {matchingSkills.length > 3 && (
                              <span className="notif-item__skill-more">+{matchingSkills.length - 3}</span>
                            )}
                          </div>
                        )}
                        <div className="notif-item__date">
                          <Clock className="w-3 h-3" />
                          {isNew ? 'New · ' : ''}{internship.postedDate}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 ml-auto" />
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              {matchedInternships.length > 0 && (
                <div className="notif-dropdown__footer">
                  <button onClick={handleViewAll} className="notif-view-all-btn">
                    View All Matched Internships
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
