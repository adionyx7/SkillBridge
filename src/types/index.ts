export type UserRole = 'student' | 'company' | 'admin' | 'guest';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  location: string;
  skills: Record<string, number>; // Skill name -> score (0-100)
  enrolledCourses: string[];
  completedCourses: string[];
  quizScores: Record<string, number>;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  streak: number;
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  email: string;
  website: string;
  industry: string;
  location: string;
  description: string;
  isVerified: boolean;
  logo?: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  studentsCount: number;
  thumbnail: string;
  lessons: Lesson[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  skill: string;
  title: string;
  passingScore: number;
  questions: Question[];
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  position: string;
  requiredSkills: string[];
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  duration: string;
  stipend: string;
  postedDate: string;
  description: string;
  eligibilityRequirements: string[];
  applicantsCount?: number;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Rejected';

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentBranch: string;
  studentYear: string;
  appliedDate: string;
  status: ApplicationStatus;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  studentSkillScores: Record<string, number>;
}

export interface CertificateAttachment {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  isVerified?: boolean;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface ShowcasePost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'company' | 'admin';
  authorCollege?: string;
  authorBranch?: string;
  authorAvatar?: string;
  bioHeadline: string;
  content: string;
  postType: 'certificate' | 'experience' | 'project' | 'achievement';
  certificates: CertificateAttachment[];
  images: string[];
  tags: string[];
  likesCount: number;
  likedBy: string[];
  comments: PostComment[];
  createdAt: string;
}

