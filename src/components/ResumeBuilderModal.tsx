import React, { useState, useEffect } from 'react';
import { X, Printer, Plus, Trash2, Github, Linkedin, Mail, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ResumeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
}

export const ResumeBuilderModal: React.FC<ResumeBuilderModalProps> = ({ isOpen, onClose }) => {
  const { currentStudent } = useApp();

  // Resume State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [objective, setObjective] = useState('');
  
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  
  const [skillInput, setSkillInput] = useState('');

  // Prefill from currentStudent
  useEffect(() => {
    if (isOpen && currentStudent) {
      setName(currentStudent.name || '');
      setEmail(currentStudent.email || '');
      setLocation(currentStudent.location || '');
      setLinkedin(currentStudent.linkedinUrl || '');
      setGithub(currentStudent.githubUrl || '');
      setObjective(currentStudent.bio || '');

      setSkills(Object.keys(currentStudent.skills || {}));

      if (currentStudent.college) {
        setEducations([{
          id: '1',
          institution: currentStudent.college,
          degree: currentStudent.branch ? `${currentStudent.degree || 'Degree'} in ${currentStudent.branch}` : (currentStudent.degree || ''),
          year: currentStudent.year || '',
        }]);
      } else {
        setEducations([]);
      }
      
      // Defaults if empty
      setExperiences([{
        id: '1',
        company: '',
        role: '',
        duration: '',
        description: ''
      }]);
      
      setProjects([{
        id: '1',
        title: '',
        description: '',
        link: ''
      }]);
    }
  }, [isOpen, currentStudent]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const addEducation = () => setEducations([...educations, { id: Date.now().toString(), institution: '', degree: '', year: '' }]);
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const removeEducation = (id: string) => setEducations(educations.filter(e => e.id !== id));

  const addExperience = () => setExperiences([...experiences, { id: Date.now().toString(), company: '', role: '', duration: '', description: '' }]);
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const removeExperience = (id: string) => setExperiences(experiences.filter(e => e.id !== id));

  const addProject = () => setProjects([...projects, { id: Date.now().toString(), title: '', description: '', link: '' }]);
  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  const removeProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  const removeSkill = (sk: string) => setSkills(skills.filter(s => s !== sk));

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950/80 backdrop-blur-sm resume-builder-overlay">
      <div className="w-full h-full max-w-[1600px] mx-auto bg-slate-50 flex flex-col md:flex-row overflow-hidden relative shadow-2xl">
        
        {/* Header / Close (Mobile only overlay mostly, on desktop it's integrated) */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow hover:bg-slate-100 no-print">
          <X className="w-6 h-6 text-slate-700" />
        </button>

        {/* EDITOR PANE */}
        <div className="w-full md:w-1/3 bg-white border-r border-slate-200 flex flex-col h-full no-print">
          <div className="p-6 border-b border-slate-200 bg-indigo-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-outfit text-indigo-900">Resume Builder</h2>
              <p className="text-sm text-indigo-600">Auto-filled from your profile</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition"
            >
              <Printer className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            
            {/* Personal Info */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Personal Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <input className="input-field" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                <input className="input-field" placeholder="Objective / Bio" value={objective} onChange={e => setObjective(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <input className="input-field" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                  <input className="input-field" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <input className="input-field" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <input className="input-field" placeholder="LinkedIn URL" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
                  <input className="input-field" placeholder="GitHub URL" value={github} onChange={e => setGithub(e.target.value)} />
                </div>
              </div>
            </section>

            {/* Experience */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Experience</h3>
                <button onClick={addExperience} className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
              </div>
              {experiences.map((exp) => (
                <div key={exp.id} className="p-4 border border-slate-200 rounded-xl relative space-y-3 bg-slate-50">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  <input className="input-field bg-white" placeholder="Role (e.g. Frontend Intern)" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field bg-white" placeholder="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                    <input className="input-field bg-white" placeholder="Duration (e.g. Jun 2023 - Aug 2023)" value={exp.duration} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} />
                  </div>
                  <textarea className="input-field bg-white min-h-[60px]" placeholder="Description (bullet points recommended)" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} />
                </div>
              ))}
            </section>

            {/* Education */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Education</h3>
                <button onClick={addEducation} className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
              </div>
              {educations.map((edu) => (
                <div key={edu.id} className="p-4 border border-slate-200 rounded-xl relative space-y-3 bg-slate-50">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  <input className="input-field bg-white" placeholder="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field bg-white" placeholder="Degree / Branch" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                    <input className="input-field bg-white" placeholder="Graduation Year" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} />
                  </div>
                </div>
              ))}
            </section>

            {/* Projects */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Projects</h3>
                <button onClick={addProject} className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
              </div>
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 border border-slate-200 rounded-xl relative space-y-3 bg-slate-50">
                  <button onClick={() => removeProject(proj.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field bg-white" placeholder="Project Title" value={proj.title} onChange={e => updateProject(proj.id, 'title', e.target.value)} />
                    <input className="input-field bg-white" placeholder="Link (optional)" value={proj.link} onChange={e => updateProject(proj.id, 'link', e.target.value)} />
                  </div>
                  <textarea className="input-field bg-white min-h-[60px]" placeholder="Description" value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} />
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Skills</h3>
              <div className="flex gap-2">
                <input 
                  className="input-field flex-1" 
                  placeholder="e.g. React, Python" 
                  value={skillInput} 
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} className="px-4 bg-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-300">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-xs font-bold flex items-center gap-1">
                    {s} <button onClick={() => removeSkill(s)}><X className="w-3 h-3 hover:text-red-500"/></button>
                  </span>
                ))}
              </div>
            </section>

            <style>{`
              .input-field {
                width: 100%;
                padding: 10px 14px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
                background: white;
                font-size: 14px;
                outline: none;
                transition: all 0.2s;
              }
              .input-field:focus {
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
              }
            `}</style>
          </div>
        </div>

        {/* PREVIEW PANE (Resume A4 aspect ratio) */}
        <div className="w-full md:w-2/3 bg-slate-200 p-8 overflow-y-auto flex justify-center print-preview-container">
          
          <div className="bg-white shadow-lg w-full max-w-[800px] h-max min-h-[1100px] print-resume-document" style={{ padding: '40px 50px' }}>
            
            {/* Header */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                {name || 'Your Name'}
              </h1>
              {objective && <p className="text-slate-600 mt-2 text-sm max-w-2xl">{objective}</p>}
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-slate-600">
                {email && <div className="flex items-center gap-1"><Mail className="w-3 h-3"/> {email}</div>}
                {phone && <div className="flex items-center gap-1">Phone: {phone}</div>}
                {location && <div className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {location}</div>}
                {linkedin && <div className="flex items-center gap-1"><Linkedin className="w-3 h-3"/> {linkedin}</div>}
                {github && <div className="flex items-center gap-1"><Github className="w-3 h-3"/> {github}</div>}
              </div>
            </div>

            {/* Experience */}
            {experiences.some(e => e.company || e.role) && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-4">Experience</h2>
                <div className="space-y-4">
                  {experiences.filter(e => e.company || e.role).map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-900">{exp.role} {exp.company && <span className="font-normal text-slate-600">at {exp.company}</span>}</h3>
                        <span className="text-xs text-slate-500 font-semibold">{exp.duration}</span>
                      </div>
                      {exp.description && (
                        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap ml-4" style={{ listStyleType: 'disc', display: 'list-item' }}>
                           {exp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {educations.some(e => e.institution || e.degree) && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-4">Education</h2>
                <div className="space-y-3">
                  {educations.filter(e => e.institution || e.degree).map(edu => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <h3 className="font-bold text-slate-900">{edu.institution}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">{edu.degree}</p>
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.some(p => p.title || p.description) && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-4">Projects</h2>
                <div className="space-y-4">
                  {projects.filter(p => p.title || p.description).map(proj => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-900">{proj.title}</h3>
                        {proj.link && <span className="text-xs text-indigo-600">{proj.link}</span>}
                      </div>
                      {proj.description && (
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {skills.map(s => (
                    <span key={s} className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
