import React, { useState } from 'react';
import {
  MapPin,
  UserCheck,
  Grid,
  Compass,
  GraduationCap,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface MegaMenuSelection {
  filterType: 'location' | 'profile' | 'category' | 'explore' | 'course';
  value: string;
}

interface InternshipMegaMenuProps {
  onSelectOption: (selection: MegaMenuSelection) => void;
  onClose: () => void;
}

type TabKey = 'locations' | 'profile' | 'categories' | 'explore' | 'courses';

export const InternshipMegaMenu: React.FC<InternshipMegaMenuProps> = ({ onSelectOption, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('locations');

  const tabs: { id: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'locations', label: 'Top Locations', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'categories', label: 'Top Categories', icon: Grid },
    { id: 'explore', label: 'Explore More Internships', icon: Compass },
    { id: 'courses', label: 'Placement Courses', icon: GraduationCap }
  ];

  const contentMap: Record<TabKey, { label: string; selection: MegaMenuSelection; isHighlight?: boolean }[]> = {
    locations: [
      { label: 'Work from Home', selection: { filterType: 'location', value: 'Remote' } },
      { label: 'Internship in Bangalore', selection: { filterType: 'location', value: 'Bengaluru' } },
      { label: 'Internship in Delhi', selection: { filterType: 'location', value: 'Delhi' } },
      { label: 'Internship in Hyderabad', selection: { filterType: 'location', value: 'Hyderabad' } },
      { label: 'Internship in Mumbai', selection: { filterType: 'location', value: 'Mumbai' } },
      { label: 'Internship in Chennai', selection: { filterType: 'location', value: 'Chennai' } },
      { label: 'Internship in Pune', selection: { filterType: 'location', value: 'Pune' } },
      { label: 'Internship in Kolkata', selection: { filterType: 'location', value: 'Kolkata' } },
      { label: 'Internship in Jaipur', selection: { filterType: 'location', value: 'Jaipur' } },
      { label: 'International Internship', selection: { filterType: 'location', value: 'International' } },
      { label: 'View all internships', selection: { filterType: 'location', value: 'All' }, isHighlight: true }
    ],
    profile: [
      { label: 'Computer Science Internship', selection: { filterType: 'profile', value: 'Computer Science' } },
      { label: 'Marketing Internship', selection: { filterType: 'profile', value: 'Marketing' } },
      { label: 'Finance Internship', selection: { filterType: 'profile', value: 'Finance' } },
      { label: 'Graphic Design Internship', selection: { filterType: 'profile', value: 'Graphic Design' } },
      { label: 'Architecture Internship', selection: { filterType: 'profile', value: 'Architecture' } },
      { label: 'Mechanical Internship', selection: { filterType: 'profile', value: 'Mechanical' } },
      { label: 'HR Internship', selection: { filterType: 'profile', value: 'Human Resource' } },
      { label: 'Digital Marketing Internship', selection: { filterType: 'profile', value: 'Digital Marketing' } },
      { label: 'Law Internship', selection: { filterType: 'profile', value: 'Law' } },
      { label: 'Electronics Internship', selection: { filterType: 'profile', value: 'Electronics' } },
      { label: 'Content Writing Internship', selection: { filterType: 'profile', value: 'Content Writing' } }
    ],
    categories: [
      { label: 'Engineering Internship', selection: { filterType: 'category', value: 'Engineering' } },
      { label: 'Business/MBA Internship', selection: { filterType: 'category', value: 'Business' } },
      { label: 'Humanities Internship', selection: { filterType: 'category', value: 'Humanities' } },
      { label: 'Science Internship', selection: { filterType: 'category', value: 'Science' } },
      { label: 'Internships with Job Offer', selection: { filterType: 'category', value: 'Job Offer' } },
      { label: 'Part-Time Jobs/Internships', selection: { filterType: 'category', value: 'Part-Time' } },
      { label: 'Internships for Women', selection: { filterType: 'category', value: 'Women' } },
      { label: 'View all internships', selection: { filterType: 'category', value: 'All' }, isHighlight: true }
    ],
    explore: [
      { label: 'Internships by Category', selection: { filterType: 'explore', value: 'Category' } },
      { label: 'Internships by Location', selection: { filterType: 'explore', value: 'Location' } },
      { label: 'Internships by Company', selection: { filterType: 'explore', value: 'Company' } }
    ],
    courses: [
      { label: 'Full Stack Development', selection: { filterType: 'course', value: 'Full Stack' }, isHighlight: true },
      { label: 'Data Science', selection: { filterType: 'course', value: 'Data Science' } },
      { label: 'Digital Marketing', selection: { filterType: 'course', value: 'Digital Marketing' } },
      { label: 'Human Resource Management', selection: { filterType: 'course', value: 'Human Resource' } },
      { label: 'UI/UX Design', selection: { filterType: 'course', value: 'UI/UX' } }
    ]
  };

  const handleItemClick = (item: { selection: MegaMenuSelection }) => {
    onSelectOption(item.selection);
    onClose();
  };

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[720px] max-w-[95vw] bg-slate-950/95 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden z-50 animate-fadeIn"
    >
      <div className="grid grid-cols-12 min-h-[380px]">
        {/* Left Column - Category Sidebar */}
        <div className="col-span-5 bg-slate-900/60 p-3 border-r border-slate-800/80 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Browse Internships
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onMouseEnter={() => setActiveTab(tab.id)}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-inner'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 text-xs">
            <p className="font-bold text-indigo-300 mb-0.5">SkillBridge Verified</p>
            <p className="text-[11px] text-slate-400">Direct referral & AI skill matching active.</p>
          </div>
        </div>

        {/* Right Column - Dynamic Options List */}
        <div className="col-span-7 p-5 bg-slate-950/80 overflow-y-auto max-h-[420px]">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h4>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
              {contentMap[activeTab].length} Options
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {contentMap[activeTab].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  item.isHighlight
                    ? 'text-indigo-400 font-bold hover:bg-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                }`}
              >
                <span className="truncate">{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
