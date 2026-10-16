import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X, Target, Sparkles, ChevronRight, BookOpen, Code2, Database,
  Layers, Brain, ShieldCheck, TrendingUp, Award, Clock, CheckCircle2,
  Circle, ArrowRight, Lightbulb, Rocket, Star, Zap, AlertTriangle,
} from 'lucide-react';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateCourses?: () => void;
  initialGoal?: string | null;
}

// ─── ROADMAP TEMPLATES ───────────────────────────────────────────────────────

interface Milestone {
  phase: string;
  duration: string;
  title: string;
  goals: string[];
  skills: string[];
}

interface RoadmapTemplate {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  requiredSkills: string[];
  description: string;
  milestones: Milestone[];
  projects: string[];
  resources: string[];
  careerTips: string[];
  keywords: string[];
}

const ROADMAP_TEMPLATES: RoadmapTemplate[] = [
  {
    id: 'fullstack',
    keywords: ['full stack', 'fullstack', 'full-stack', 'web developer', 'web development', 'frontend', 'backend', 'mern', 'react', 'node'],
    title: 'Full-Stack Web Developer',
    icon: <Layers className="w-6 h-6" />,
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
    requiredSkills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
    description: 'Master both frontend and backend technologies to build modern, scalable web applications.',
    milestones: [
      {
        phase: 'Month 1',
        duration: '0–4 weeks',
        title: 'Foundations',
        goals: ['Master HTML5, CSS3, and Flexbox/Grid', 'Learn JavaScript fundamentals (ES6+)', 'Build 2 static websites', 'Set up GitHub profile'],
        skills: ['HTML/CSS', 'JavaScript', 'Git'],
      },
      {
        phase: 'Month 3',
        duration: '5–12 weeks',
        title: 'Frontend Mastery',
        goals: ['Learn React.js & React Hooks', 'Build a portfolio SPA', 'Understand REST APIs', 'Learn Tailwind / CSS frameworks'],
        skills: ['React', 'REST API', 'TypeScript'],
      },
      {
        phase: 'Month 6',
        duration: '13–24 weeks',
        title: 'Backend & Databases',
        goals: ['Learn Node.js + Express', 'Master SQL and NoSQL (MongoDB)', 'Build a full CRUD application', 'Deploy on Vercel/Railway'],
        skills: ['Node.js', 'SQL', 'MongoDB', 'Docker'],
      },
      {
        phase: 'Month 12',
        duration: '7–12 months',
        title: 'Production-Ready',
        goals: ['Build a production project (SaaS / platform)', 'Learn CI/CD & DevOps basics', 'Contribute to open source', 'Apply for internships & jobs'],
        skills: ['Docker', 'AWS/GCP', 'System Design', 'Testing'],
      },
    ],
    projects: ['Personal Portfolio Website', 'E-Commerce Store (MERN)', 'Real-time Chat App', 'Job Board Platform'],
    resources: ['The Odin Project (free)', 'Fullstack Open (free)', 'JavaScript.info', 'React Docs (react.dev)'],
    careerTips: [
      'Build in public — share projects on LinkedIn and Twitter.',
      'Contribute to open-source on GitHub to build credibility.',
      'Always complete one project end-to-end before learning new tech.',
      'Apply to internships even if you feel "not ready" — confidence comes from rejection, not waiting.'
    ],
  },
  {
    id: 'datascience',
    keywords: ['data science', 'data scientist', 'data analyst', 'analytics', 'data engineering', 'data'],
    title: 'Data Science & Analytics',
    icon: <Database className="w-6 h-6" />,
    color: '#10b981',
    gradient: 'from-emerald-500 to-cyan-600',
    requiredSkills: ['Python', 'Statistics', 'SQL', 'Machine Learning', 'Data Visualization', 'Pandas'],
    description: 'Transform raw data into actionable insights using statistics, programming, and machine learning.',
    milestones: [
      {
        phase: 'Month 1',
        duration: '0–4 weeks',
        title: 'Python & Statistics',
        goals: ['Master Python basics (NumPy, Pandas)', 'Learn descriptive statistics', 'SQL fundamentals', 'Complete Kaggle Python course'],
        skills: ['Python', 'SQL', 'Statistics'],
      },
      {
        phase: 'Month 3',
        duration: '5–12 weeks',
        title: 'Analysis & Visualization',
        goals: ['Data cleaning & EDA pipelines', 'Matplotlib, Seaborn, Plotly', 'Build 3 end-to-end analysis projects', 'Learn Excel/Google Sheets for stakeholders'],
        skills: ['Data Visualization', 'Pandas', 'EDA'],
      },
      {
        phase: 'Month 6',
        duration: '13–24 weeks',
        title: 'Machine Learning',
        goals: ['Scikit-learn: regression, classification, clustering', 'Feature engineering & model evaluation', 'Kaggle competition (top 25%)', 'Learn MLflow for tracking'],
        skills: ['Machine Learning', 'Scikit-learn', 'Feature Engineering'],
      },
      {
        phase: 'Month 12',
        duration: '7–12 months',
        title: 'Specialization & Portfolio',
        goals: ['Deep Learning basics (TensorFlow / PyTorch)', 'Build a capstone project (end-to-end ML pipeline)', 'Deploy a model as an API', 'Apply for data internships'],
        skills: ['Deep Learning', 'MLOps', 'Cloud (AWS/GCP)'],
      },
    ],
    projects: ['Customer Churn Prediction', 'Sales Forecasting Dashboard', 'Sentiment Analysis App', 'Stock Price Predictor'],
    resources: ['Kaggle Learn (free)', 'CS50P — Python (free)', 'StatQuest on YouTube', 'Hands-on ML with Scikit-Learn (O\'Reilly)'],
    careerTips: [
      'Build a portfolio of 3 solid projects on GitHub with clear READMEs.',
      'Document every analysis — show your thinking, not just the code.',
      'Network with data professionals on LinkedIn — share your Kaggle achievements.',
      'Focus on storytelling: stakeholders care about insights, not models.'
    ],
  },
  {
    id: 'ml',
    keywords: ['machine learning', 'ml', 'artificial intelligence', 'ai', 'deep learning', 'nlp', 'computer vision'],
    title: 'ML / AI Engineer',
    icon: <Brain className="w-6 h-6" />,
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-fuchsia-600',
    requiredSkills: ['Python', 'Mathematics', 'Machine Learning', 'Deep Learning', 'TensorFlow/PyTorch', 'Statistics'],
    description: 'Design and deploy intelligent systems powered by machine learning and deep neural networks.',
    milestones: [
      {
        phase: 'Month 1',
        duration: '0–4 weeks',
        title: 'Math & Python Foundations',
        goals: ['Linear Algebra (Khan Academy)', 'Calculus & Probability basics', 'Python: NumPy, Pandas, Matplotlib', 'Andrew Ng\'s ML course (Coursera, first 2 weeks)'],
        skills: ['Python', 'Mathematics', 'Statistics'],
      },
      {
        phase: 'Month 3',
        duration: '5–12 weeks',
        title: 'Classical ML Mastery',
        goals: ['Supervised & Unsupervised learning', 'Model evaluation, overfitting, regularization', 'Win a Kaggle tabular competition', 'Scikit-learn deep dive'],
        skills: ['Machine Learning', 'Scikit-learn', 'Feature Engineering'],
      },
      {
        phase: 'Month 6',
        duration: '13–24 weeks',
        title: 'Deep Learning',
        goals: ['Neural networks from scratch (backprop)', 'CNNs (Computer Vision)', 'RNNs / Transformers (NLP basics)', 'Fine-tune a HuggingFace model'],
        skills: ['Deep Learning', 'PyTorch', 'TensorFlow', 'NLP'],
      },
      {
        phase: 'Month 12',
        duration: '7–12 months',
        title: 'System & Research',
        goals: ['MLOps: Docker, MLflow, model serving', 'Read and implement 2 ML papers', 'Build an end-to-end AI product', 'Apply to FAANG/top-tier AI internships'],
        skills: ['MLOps', 'Research', 'System Design', 'Cloud'],
      },
    ],
    projects: ['Image Classifier (CNN)', 'Chatbot with Transformers', 'Recommendation Engine', 'Object Detection App'],
    resources: ['fast.ai (free, practical-first)', 'Deep Learning Specialization — Coursera', 'Papers With Code', 'd2l.ai (Dive into Deep Learning)'],
    careerTips: [
      'Start with Andrew Ng\'s courses — they are the gold standard baseline.',
      'Math matters but don\'t get stuck — implement first, derive later.',
      'Follow ML Twitter/X: @karpathy, @GuggerSylvain, @fchollet.',
      'Reproduce a famous paper as a project — it demonstrates research ability.'
    ],
  },
  {
    id: 'cybersecurity',
    keywords: ['cybersecurity', 'security', 'ethical hacking', 'penetration testing', 'pen test', 'devSecOps', 'network security'],
    title: 'Cybersecurity Engineer',
    icon: <ShieldCheck className="w-6 h-6" />,
    color: '#ef4444',
    gradient: 'from-rose-500 to-orange-600',
    requiredSkills: ['Networking', 'Linux', 'Python', 'Cryptography', 'Web Security', 'OSINT'],
    description: 'Protect systems and networks by understanding and countering cyber threats.',
    milestones: [
      {
        phase: 'Month 1',
        duration: '0–4 weeks',
        title: 'Networking & Linux',
        goals: ['TCP/IP, DNS, HTTP fundamentals', 'Linux command line mastery', 'Set up a home lab (VirtualBox + Kali)', 'CompTIA Network+ study plan'],
        skills: ['Networking', 'Linux', 'CLI'],
      },
      {
        phase: 'Month 3',
        duration: '5–12 weeks',
        title: 'Web & App Security',
        goals: ['OWASP Top 10 vulnerabilities', 'Burp Suite basics', 'CTF beginner challenges (TryHackMe)', 'Python scripting for automation'],
        skills: ['Web Security', 'Python', 'Burp Suite'],
      },
      {
        phase: 'Month 6',
        duration: '13–24 weeks',
        title: 'Penetration Testing',
        goals: ['Full pentesting lifecycle', 'HackTheBox intermediate machines', 'Metasploit framework', 'Write professional pentest reports'],
        skills: ['Penetration Testing', 'Metasploit', 'OSINT'],
      },
      {
        phase: 'Month 12',
        duration: '7–12 months',
        title: 'Certification & Career',
        goals: ['Achieve CEH or OSCP certification', 'Bug bounty submissions (HackerOne)', 'Build a security blog', 'Apply for SOC Analyst or pentester internships'],
        skills: ['OSCP / CEH', 'Bug Bounty', 'Blue Team', 'Cloud Security'],
      },
    ],
    projects: ['Home SOC Lab', 'CTF Write-ups Blog', 'Web App Vulnerability Scanner', 'Password Auditing Tool'],
    resources: ['TryHackMe (free tier)', 'HackTheBox', 'The Web Application Hacker\'s Handbook', 'TCM Security courses'],
    careerTips: [
      'Get a certification (CEH, CompTIA Security+) early — employers recognize them.',
      'Play CTFs regularly — they\'re the fastest way to build practical skills.',
      'Bug bounty hunting builds real-world experience and can earn you money.',
      'Never practice on systems you don\'t own — use labs and VMs.'
    ],
  },
  {
    id: 'mobile',
    keywords: ['mobile', 'android', 'ios', 'flutter', 'react native', 'app developer', 'mobile developer'],
    title: 'Mobile App Developer',
    icon: <Code2 className="w-6 h-6" />,
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-500',
    requiredSkills: ['Dart/Flutter', 'JavaScript/React Native', 'REST APIs', 'Firebase', 'UI/UX', 'Git'],
    description: 'Build beautiful cross-platform mobile apps for iOS and Android using modern frameworks.',
    milestones: [
      {
        phase: 'Month 1',
        duration: '0–4 weeks',
        title: 'Mobile Foundations',
        goals: ['Choose Flutter or React Native', 'Learn Dart or JS basics', 'Build 2 simple apps (counter, todo)', 'Understand mobile UI conventions'],
        skills: ['Dart/Flutter', 'Mobile UI', 'Git'],
      },
      {
        phase: 'Month 3',
        duration: '5–12 weeks',
        title: 'Core Development',
        goals: ['State management (Provider/Riverpod/Redux)', 'Navigation and routing', 'API integration & async patterns', 'Firebase: auth + Firestore'],
        skills: ['State Management', 'Firebase', 'REST APIs'],
      },
      {
        phase: 'Month 6',
        duration: '13–24 weeks',
        title: 'Advanced Features',
        goals: ['Push notifications', 'Local storage & offline mode', 'Maps & geolocation', 'Publish an app to Play Store'],
        skills: ['Firebase Cloud Messaging', 'SQLite', 'Maps SDK'],
      },
      {
        phase: 'Month 12',
        duration: '7–12 months',
        title: 'Portfolio & Launch',
        goals: ['Build a full-featured app (1000+ users)', 'Implement payments (Stripe/Razorpay)', 'App Store optimization', 'Apply for mobile dev internships'],
        skills: ['CI/CD', 'Analytics', 'Performance Profiling'],
      },
    ],
    projects: ['Weather App', 'Expense Tracker', 'Habit Tracker with Notifications', 'Food Delivery Clone'],
    resources: ['Flutter.dev docs (free)', 'Angela Yu\'s Flutter course (Udemy)', 'fireship.io', 'React Native docs'],
    careerTips: [
      'Focus on one framework (Flutter or React Native) — don\'t switch halfway.',
      'Ship an app to the Play Store ASAP — real users beat side projects in interviews.',
      'Learn design basics — mobile apps live and die by UX.',
      'Follow the official changelogs — mobile ecosystems change fast.'
    ],
  },
];

const DEFAULT_TEMPLATE: RoadmapTemplate = {
  id: 'general',
  keywords: [],
  title: 'Tech Career Path',
  icon: <Rocket className="w-6 h-6" />,
  color: '#6366f1',
  gradient: 'from-indigo-500 to-purple-600',
  requiredSkills: ['Programming', 'Problem Solving', 'Communication', 'Version Control', 'System Design'],
  description: 'A general roadmap to establish yourself as a strong tech professional.',
  milestones: [
    {
      phase: 'Month 1',
      duration: '0–4 weeks',
      title: 'Identify & Learn Core Skills',
      goals: ['Pick a primary programming language', 'Complete an online fundamentals course', 'Set up Git and GitHub profile', 'Join a tech community (Discord/LinkedIn)'],
      skills: ['Programming', 'Git', 'Communication'],
    },
    {
      phase: 'Month 3',
      duration: '5–12 weeks',
      title: 'Build Your First Projects',
      goals: ['Complete 2 guided projects', 'Understand data structures & algorithms basics', 'Start your portfolio website', 'Solve 30 LeetCode easy problems'],
      skills: ['DSA', 'Problem Solving', 'Portfolio'],
    },
    {
      phase: 'Month 6',
      duration: '13–24 weeks',
      title: 'Deepen & Specialize',
      goals: ['Choose a specialization (Web, Data, Mobile)', 'Complete a domain-specific project', 'Start applying for internships', 'Build a professional LinkedIn profile'],
      skills: ['Specialization Skill', 'Networking', 'Resume Writing'],
    },
    {
      phase: 'Month 12',
      duration: '7–12 months',
      title: 'Land Your First Role',
      goals: ['Apply to 50+ positions', 'Prep for technical interviews (DSA + system design)', 'Get referrals through networking', 'Keep building and shipping projects'],
      skills: ['Interview Prep', 'System Design', 'Leadership'],
    },
  ],
  projects: ['Portfolio Website', 'CLI Tool in your chosen language', 'API integration project', 'Open-source contribution'],
  resources: ['CS50 (free, Harvard)', 'freeCodeCamp', 'Roadmap.sh', 'MIT OpenCourseWare'],
  careerTips: [
    'Skills + projects beat degrees in tech. Start building today.',
    'Apply earlier than you think you\'re ready — imposter syndrome is universal.',
    'Networking is a multiplier. One connection can open 10 doors.',
    'Consistency beats intensity. 1 hour daily > 10 hours on weekends.'
  ],
};

function detectTemplate(goal: string): RoadmapTemplate {
  const lower = goal.toLowerCase();
  for (const tmpl of ROADMAP_TEMPLATES) {
    if (tmpl.keywords.some(k => lower.includes(k))) return tmpl;
  }
  return DEFAULT_TEMPLATE;
}

function getMatchProgress(studentSkills: Record<string, number>, requiredSkills: string[]): number {
  if (!requiredSkills.length) return 0;
  const matched = requiredSkills.filter(s => {
    const key = Object.keys(studentSkills).find(k => k.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(k.toLowerCase()));
    return key && studentSkills[key] >= 50;
  });
  return Math.round((matched.length / requiredSkills.length) * 100);
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose, onNavigateCourses, initialGoal }) => {
  const { role, currentStudent } = useApp();
  const [goal, setGoal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [template, setTemplate] = useState<RoadmapTemplate | null>(null);
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialGoal) {
        setGoal(initialGoal);
        setIsGenerating(true);
        setTimeout(() => {
          const tmpl = detectTemplate(initialGoal);
          setTemplate(tmpl);
          setSubmitted(true);
          setIsGenerating(false);
          setActiveMilestone(0);
        }, 600); // Simulate generation
      } else {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } else {
      setGoal('');
      setSubmitted(false);
      setTemplate(null);
      setActiveMilestone(0);
      setIsGenerating(false);
    }
  }, [isOpen, initialGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const tmpl = detectTemplate(goal);
      setTemplate(tmpl);
      setSubmitted(true);
      setIsGenerating(false);
      setActiveMilestone(0);
    }, 1200); // Simulated generation delay
  };

  const handleReset = () => {
    setGoal('');
    setSubmitted(false);
    setTemplate(null);
    setActiveMilestone(0);
  };

  const currentProgress = template && currentStudent
    ? getMatchProgress(currentStudent.skills, template.requiredSkills)
    : 0;

  const getSkillStatus = (skillName: string): 'strong' | 'partial' | 'missing' => {
    if (!currentStudent) return 'missing';
    const key = Object.keys(currentStudent.skills).find(
      k => k.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(k.toLowerCase())
    );
    if (!key) return 'missing';
    const score = currentStudent.skills[key];
    if (score >= 70) return 'strong';
    if (score >= 40) return 'partial';
    return 'missing';
  };

  if (!isOpen) return null;

  return (
    <div className="roadmap-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="roadmap-modal" role="dialog" aria-modal="true" aria-label="AIM & Roadmap">

        {/* Modal Header */}
        <div className="roadmap-modal__header">
          <div className="roadmap-modal__header-brand">
            <div className="roadmap-header-icon">
              <Target className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="roadmap-modal__title">AIM & Roadmap</h2>
              <p className="roadmap-modal__subtitle">Tell us your goal — we'll build your path</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {submitted && (
              <button onClick={handleReset} className="roadmap-reset-btn">
                New Goal
              </button>
            )}
            <button onClick={onClose} className="roadmap-close-btn" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="roadmap-modal__body">

          {/* ── GOAL INPUT STATE ── */}
          {!submitted && (
            <div className="roadmap-input-section">
              <div className="roadmap-input-hero">
                <div className="roadmap-input-hero__icon">
                  <Rocket className="w-12 h-12 text-indigo-400" />
                  <div className="roadmap-input-hero__sparkles">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <h3>What's your career goal?</h3>
                <p>
                  Type your ambition — be specific! Examples:<br />
                  <em>"Become a Full-Stack Developer"</em>,{' '}
                  <em>"Land a Data Science internship at Google"</em>,{' '}
                  <em>"Build an AI/ML career"</em>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="roadmap-form">
                <div className="roadmap-input-wrapper">
                  <Target className="roadmap-input__icon" />
                  <input
                    ref={inputRef}
                    id="roadmap-goal-input"
                    type="text"
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="e.g. Become a Machine Learning Engineer at a top company..."
                    className="roadmap-input"
                    maxLength={150}
                  />
                </div>
                <button
                  type="submit"
                  id="roadmap-generate-btn"
                  disabled={!goal.trim() || isGenerating}
                  className="roadmap-generate-btn"
                >
                  {isGenerating ? (
                    <>
                      <span className="roadmap-spinner" />
                      Generating your roadmap...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate My Roadmap
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick suggestions */}
              <div className="roadmap-suggestions">
                <span className="roadmap-suggestions__label">Quick picks:</span>
                {['Full-Stack Developer', 'Data Scientist', 'ML/AI Engineer', 'Cybersecurity Expert', 'Mobile Developer'].map(s => (
                  <button
                    key={s}
                    className="roadmap-suggestion-pill"
                    onClick={() => setGoal(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── ROADMAP RESULT STATE ── */}
          {submitted && template && (
            <div className="roadmap-result">

              {/* Goal Banner */}
              <div className="roadmap-goal-banner" style={{ borderColor: template.color + '40' }}>
                <div className="roadmap-goal-banner__icon" style={{ background: `linear-gradient(135deg, ${template.color}30, ${template.color}15)`, border: `1px solid ${template.color}40` }}>
                  {template.icon}
                </div>
                <div className="roadmap-goal-banner__content">
                  <span className="roadmap-goal-banner__label">Your Goal</span>
                  <h3 className="roadmap-goal-banner__title">"{goal}"</h3>
                  <span className="roadmap-goal-banner__track">Career Track: <strong>{template.title}</strong></span>
                </div>
              </div>

              {/* Progress Section (only for students) */}
              {currentStudent && (
                <div className="roadmap-progress-card">
                  <div className="roadmap-progress-card__header">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <span>Your Current Alignment</span>
                    <span className="roadmap-progress-card__pct" style={{ color: currentProgress >= 60 ? '#10b981' : currentProgress >= 30 ? '#f59e0b' : '#f87171' }}>
                      {currentProgress}%
                    </span>
                  </div>
                  <div className="roadmap-progress-bar-bg">
                    <div
                      className="roadmap-progress-bar-fill"
                      style={{ width: `${currentProgress}%`, background: `linear-gradient(90deg, ${template.color}, ${template.color}aa)` }}
                    />
                  </div>
                  <p className="roadmap-progress-card__desc">
                    {currentProgress >= 70
                      ? '🎯 You\'re well-aligned! Focus on advanced skills and projects.'
                      : currentProgress >= 40
                      ? '📈 Good start! Close the skill gaps below to accelerate your journey.'
                      : '🚀 Great time to start! Your roadmap below is tailored to build you from the ground up.'}
                  </p>

                  {/* Skill gap analysis */}
                  <div className="roadmap-skill-grid">
                    {template.requiredSkills.map(skill => {
                      const status = getSkillStatus(skill);
                      return (
                        <div key={skill} className={`roadmap-skill-chip roadmap-skill-chip--${status}`}>
                          {status === 'strong' ? <CheckCircle2 className="w-3 h-3" /> : status === 'partial' ? <Zap className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                          {skill}
                        </div>
                      );
                    })}
                  </div>
                  <div className="roadmap-skill-legend">
                    <span><CheckCircle2 className="w-3 h-3 text-emerald-400 inline" /> Strong</span>
                    <span><Zap className="w-3 h-3 text-amber-400 inline" /> Partial</span>
                    <span><Circle className="w-3 h-3 text-slate-500 inline" /> To Learn</span>
                  </div>
                </div>
              )}

              {/* Milestone Timeline */}
              <div className="roadmap-section">
                <div className="roadmap-section__header">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>12-Month Milestone Roadmap</span>
                </div>

                {/* Phase tabs */}
                <div className="roadmap-phase-tabs">
                  {template.milestones.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMilestone(i)}
                      className={`roadmap-phase-tab ${activeMilestone === i ? 'roadmap-phase-tab--active' : ''}`}
                      style={activeMilestone === i ? { borderColor: template.color, color: template.color } : {}}
                    >
                      {m.phase}
                    </button>
                  ))}
                </div>

                {/* Active milestone card */}
                {template.milestones[activeMilestone] && (() => {
                  const m = template.milestones[activeMilestone];
                  return (
                    <div className="roadmap-milestone-card" style={{ borderColor: template.color + '30' }}>
                      <div className="roadmap-milestone-card__header">
                        <div className="roadmap-milestone-dot" style={{ background: template.color }} />
                        <div>
                          <h4 className="roadmap-milestone-card__title">{m.title}</h4>
                          <span className="roadmap-milestone-card__dur">{m.duration}</span>
                        </div>
                      </div>
                      <div className="roadmap-milestone-goals">
                        {m.goals.map((g, gi) => (
                          <div key={gi} className="roadmap-milestone-goal-row">
                            <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: template.color }} />
                            <span>{g}</span>
                          </div>
                        ))}
                      </div>
                      <div className="roadmap-milestone-skills">
                        <span className="roadmap-milestone-skills__label">Skills to acquire:</span>
                        {m.skills.map(s => (
                          <span key={s} className="roadmap-milestone-skill-tag" style={{ borderColor: template.color + '40', color: template.color }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Projects Section */}
              <div className="roadmap-section">
                <div className="roadmap-section__header">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>Recommended Projects</span>
                </div>
                <div className="roadmap-project-grid">
                  {template.projects.map((p, i) => (
                    <div key={i} className="roadmap-project-card">
                      <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="roadmap-section">
                <div className="roadmap-section__header">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Top Resources</span>
                </div>
                <div className="roadmap-resources-list">
                  {template.resources.map((r, i) => (
                    <div key={i} className="roadmap-resource-row">
                      <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
                {onNavigateCourses && (
                  <button onClick={() => { onClose(); onNavigateCourses(); }} className="roadmap-courses-btn">
                    <BookOpen className="w-4 h-4" />
                    Explore SkillBridge Courses
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Career Tips */}
              <div className="roadmap-section">
                <div className="roadmap-section__header">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Career Tips</span>
                </div>
                <div className="roadmap-tips-list">
                  {template.careerTips.map((tip, i) => (
                    <div key={i} className="roadmap-tip-row">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
