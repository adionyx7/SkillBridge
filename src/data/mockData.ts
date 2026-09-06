import { StudentProfile, CompanyProfile, AdminProfile, Course, Quiz, Internship, Application } from '../types';

export const initialStudents: StudentProfile[] = [
  {
    id: 'std_1',
    name: 'Alex Morgan',
    email: 'alex.student@example.com',
    college: 'IIT Bombay',
    degree: 'B.Tech',
    branch: 'Computer Science',
    year: '3rd Year',
    location: 'Mumbai, India',
    skills: {
      'Python': 82,
      'JavaScript': 75,
      'SQL': 80,
      'React': 65,
      'Node.js': 50,
      'Data Science': 40
    },
    enrolledCourses: ['course_1', 'course_3'],
    completedCourses: ['course_4'],
    quizScores: {
      'quiz_python': 85,
      'quiz_sql': 80,
      'quiz_js': 75
    },
    bio: 'Passionate developer focusing on scalable web applications and algorithmic data structures.',
    githubUrl: 'https://github.com/alexmorgan',
    linkedinUrl: 'https://linkedin.com/in/alexmorgan'
  },
  {
    id: 'std_2',
    name: 'Sophia Chen',
    email: 'sophia@example.com',
    college: 'BITS Pilani',
    degree: 'B.E.',
    branch: 'Information Systems',
    year: '4th Year',
    location: 'Bengaluru, India',
    skills: {
      'Python': 90,
      'Data Science': 88,
      'Machine Learning': 82,
      'SQL': 78
    },
    enrolledCourses: ['course_2'],
    completedCourses: ['course_2'],
    quizScores: {
      'quiz_python': 92,
      'quiz_ds': 88
    }
  }
];

export const initialCompanies: CompanyProfile[] = [
  {
    id: 'comp_1',
    companyName: 'TechCorp Innovations',
    email: 'recruiter@techcorp.com',
    website: 'https://techcorp.example.com',
    industry: 'Software & AI Solutions',
    location: 'Bengaluru, India',
    description: 'Leading cloud-native software and AI product incubator empowering global enterprises.',
    isVerified: true,
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'comp_2',
    companyName: 'DataPulse Analytics',
    email: 'careers@datapulse.ai',
    website: 'https://datapulse.ai',
    industry: 'Big Data & Business Intelligence',
    location: 'Hyderabad, India',
    description: 'Next-gen analytics platform delivering predictive metrics and automated ML pipelines.',
    isVerified: true,
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'comp_3',
    companyName: 'CloudScale Systems',
    email: 'jobs@cloudscale.io',
    website: 'https://cloudscale.io',
    industry: 'Cloud & Infrastructure',
    location: 'Pune, India',
    description: 'Kubernetes orchestration and cloud security operations.',
    isVerified: false, // Verification pending
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'comp_4',
    companyName: 'Nexus UI Studio',
    email: 'hello@nexusui.design',
    website: 'https://nexusui.design',
    industry: 'UI/UX & Product Design',
    location: 'Remote',
    description: 'Award-winning digital experience studio crafting delightful human-centered web interfaces.',
    isVerified: true,
    logo: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialAdmin: AdminProfile = {
  id: 'admin_1',
  name: 'Platform Administrator',
  email: 'admin@skillintern.com'
};

export const initialCourses: Course[] = [
  {
    id: 'course_1',
    title: 'Full-Stack Web Development with React & Node',
    description: 'Master modern frontend UI architecture with React 19, TypeScript, dynamic state management, and backend REST API integration.',
    instructor: 'David Miller (Ex-Meta Senior Engineer)',
    skill: 'React',
    difficulty: 'Intermediate',
    duration: '24 Hours',
    rating: 4.9,
    studentsCount: 4200,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l1', title: 'React 19 Hooks & Component Architecture', duration: '45 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l2', title: 'State Management with Context API', duration: '55 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l3', title: 'Building RESTful APIs with Node & Express', duration: '60 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l4', title: 'Full-Stack Project Deployment', duration: '40 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]
  },
  {
    id: 'course_2',
    title: 'Python for Data Science & Machine Learning',
    description: 'Learn data analysis with Pandas, NumPy, visualization with Seaborn, and build predictive machine learning models using Scikit-Learn.',
    instructor: 'Dr. Sarah Jenkins (AI Researcher)',
    skill: 'Python',
    difficulty: 'Beginner',
    duration: '30 Hours',
    rating: 4.8,
    studentsCount: 6100,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l21', title: 'Python Fundamentals & Data Structures', duration: '50 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l22', title: 'Data Cleaning & Manipulation with Pandas', duration: '65 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l23', title: 'Supervised Learning & Regression Models', duration: '75 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]
  },
  {
    id: 'course_3',
    title: 'Database Mastery: SQL & PostgreSQL Design',
    description: 'Comprehensive guide to relational database modeling, complex SQL joins, indexing, query optimization, and transactions.',
    instructor: 'Alex Rivera (Principal Database Architect)',
    skill: 'SQL',
    difficulty: 'Intermediate',
    duration: '16 Hours',
    rating: 4.9,
    studentsCount: 2800,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l31', title: 'Relational Schema Design & Normalization', duration: '40 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l32', title: 'Advanced Window Functions & Subqueries', duration: '50 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]
  },
  {
    id: 'course_4',
    title: 'Modern JavaScript: ES6+ Deep Dive',
    description: 'Master JavaScript asynchronous control flow, Event Loop, closures, prototypes, modules, and functional programming patterns.',
    instructor: 'Chris Hemsworth (Frontend Lead)',
    skill: 'JavaScript',
    difficulty: 'Intermediate',
    duration: '18 Hours',
    rating: 4.7,
    studentsCount: 3500,
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l41', title: 'Promises, Async/Await & Event Loop', duration: '55 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l42', title: 'Closures & Scope Chain Execution', duration: '45 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]
  },
  {
    id: 'course_5',
    title: 'UI/UX Design Systems with Figma',
    description: 'Design accessible, pixel-perfect user interfaces, create design systems, wireframes, and interactive prototypes.',
    instructor: 'Elena Rostova (Lead UX Designer)',
    skill: 'UI/UX',
    difficulty: 'Beginner',
    duration: '14 Hours',
    rating: 4.8,
    studentsCount: 1900,
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l51', title: 'Design Principles & Auto Layout in Figma', duration: '40 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l52', title: 'Building Component Libraries & Tokens', duration: '50 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]
  },
  {
    id: 'course_6',
    title: 'Cloud Engineering with AWS & Docker',
    description: 'Learn containerization with Docker, CI/CD pipelines, and cloud architecture deployment on Amazon Web Services.',
    instructor: 'Marcus Vance (DevOps Director)',
    skill: 'Cloud Computing',
    difficulty: 'Advanced',
    duration: '28 Hours',
    rating: 4.9,
    studentsCount: 1400,
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l61', title: 'Docker Containers & Docker Compose', duration: '60 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l62', title: 'AWS EC2, S3 & CloudFront Setup', duration: '70 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]
  }
];

export const initialQuizzes: Record<string, Quiz> = {
  'React': {
    id: 'quiz_react',
    skill: 'React',
    title: 'React 19 & Component Lifecycle Verification Assessment',
    passingScore: 75,
    questions: [
      {
        id: 'q_r1',
        text: 'What is the primary benefit of using React Virtual DOM?',
        options: [
          'It replaces HTML completely',
          'It minimizes direct DOM manipulations by diffing changes in memory',
          'It executes code on the server side by default',
          'It automatically converts JavaScript into C++'
        ],
        correctIndex: 1,
        explanation: 'React Virtual DOM maintains an in-memory representation of UI elements and calculates minimal updates required for the real DOM.'
      },
      {
        id: 'q_r2',
        text: 'Which Hook is best suited for caching expensive recalculations across renders?',
        options: ['useEffect', 'useCallback', 'useMemo', 'useRef'],
        correctIndex: 2,
        explanation: 'useMemo returns a memoized value that only recalculates when one of its dependencies changes.'
      },
      {
        id: 'q_r3',
        text: 'How do you pass data down through a component tree without manually passing props at every level?',
        options: ['Redux store only', 'React Context API', 'Local Storage', 'URL query parameters'],
        correctIndex: 1,
        explanation: 'React Context provides a way to share values like user authentication or theme preferences across the component tree without explicit prop drilling.'
      }
    ]
  },
  'Python': {
    id: 'quiz_python',
    skill: 'Python',
    title: 'Python Core & Data Structures Competency Test',
    passingScore: 70,
    questions: [
      {
        id: 'q_py1',
        text: 'Which data structure in Python is mutable and ordered?',
        options: ['Tuple', 'List', 'Set', 'Frozenset'],
        correctIndex: 1,
        explanation: 'Lists are ordered, mutable collections in Python.'
      },
      {
        id: 'q_py2',
        text: 'What is the time complexity of looking up a key in a Python dictionary on average?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
        correctIndex: 2,
        explanation: 'Python dictionaries use hash tables which provide O(1) average time complexity for key lookups.'
      },
      {
        id: 'q_py3',
        text: 'What does the list comprehension `[x**2 for x in range(5) if x % 2 == 0]` output?',
        options: ['[0, 4, 16]', '[1, 9]', '[0, 2, 4]', '[0, 1, 4, 9, 16]'],
        correctIndex: 0,
        explanation: 'Even numbers in range(5) are 0, 2, 4. Their squares are 0, 4, 16.'
      }
    ]
  },
  'JavaScript': {
    id: 'quiz_js',
    skill: 'JavaScript',
    title: 'JavaScript Async & ES6+ Skill Verification',
    passingScore: 75,
    questions: [
      {
        id: 'q_js1',
        text: 'What is the output of `typeof null` in JavaScript?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correctIndex: 2,
        explanation: '`typeof null` returning "object" is a historical bug in JavaScript that remains for backward compatibility.'
      },
      {
        id: 'q_js2',
        text: 'Which function creates a new array with the results of calling a provided function on every element?',
        options: ['Array.prototype.forEach', 'Array.prototype.map', 'Array.prototype.filter', 'Array.prototype.reduce'],
        correctIndex: 1,
        explanation: 'map() creates a new array populated with the results of calling a provided function on every element in the calling array.'
      }
    ]
  },
  'SQL': {
    id: 'quiz_sql',
    skill: 'SQL',
    title: 'Relational Database & SQL Querying Assessment',
    passingScore: 70,
    questions: [
      {
        id: 'q_sql1',
        text: 'Which clause is used to filter aggregated grouped data in SQL?',
        options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
        correctIndex: 1,
        explanation: 'The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions.'
      },
      {
        id: 'q_sql2',
        text: 'Which JOIN returns all rows from the left table and matched rows from the right table?',
        options: ['INNER JOIN', 'LEFT (OUTER) JOIN', 'RIGHT (OUTER) JOIN', 'FULL OUTER JOIN'],
        correctIndex: 1,
        explanation: 'LEFT JOIN returns all records from the left table, and the matched records from the right table.'
      }
    ]
  }
};

export const initialInternships: Internship[] = [
  {
    id: 'intern_1',
    companyId: 'comp_1',
    companyName: 'TechCorp Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80',
    position: 'Frontend React Engineering Intern',
    requiredSkills: ['React', 'JavaScript', 'SQL'],
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    duration: '6 Months',
    stipend: '₹35,000 / month',
    postedDate: '2 days ago',
    description: 'Join our dynamic web engine team to construct high-speed React dashboards with micro-frontend architectures.',
    eligibilityRequirements: ['Current B.Tech/B.E student (3rd or 4th year)', 'Minimum 70% verified score in React & JavaScript'],
    applicantsCount: 14
  },
  {
    id: 'intern_2',
    companyId: 'comp_2',
    companyName: 'DataPulse Analytics',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
    position: 'Data Science & ML Intern',
    requiredSkills: ['Python', 'Data Science', 'SQL'],
    location: 'Hyderabad, India',
    workMode: 'Remote',
    duration: '3 Months',
    stipend: '₹40,000 / month',
    postedDate: '1 day ago',
    description: 'Work alongside data scientists building customer churn prediction models and automated analytics dashboards.',
    eligibilityRequirements: ['Proficiency in Python and SQL', 'Background in CS, IT, or Statistics'],
    applicantsCount: 22
  },
  {
    id: 'intern_3',
    companyId: 'comp_1',
    companyName: 'TechCorp Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80',
    position: 'Full-Stack Software Development Intern',
    requiredSkills: ['Python', 'React', 'Node.js', 'SQL'],
    location: 'Bengaluru, India',
    workMode: 'On-site',
    duration: '6 Months',
    stipend: '₹45,000 / month',
    postedDate: '3 days ago',
    description: 'Develop enterprise API integrations and build frontend interfaces using modern JavaScript frameworks.',
    eligibilityRequirements: ['Good grasp of both frontend and backend concepts', 'Hands-on project portfolio'],
    applicantsCount: 19
  },
  {
    id: 'intern_4',
    companyId: 'comp_4',
    companyName: 'Nexus UI Studio',
    companyLogo: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=150&auto=format&fit=crop&q=80',
    position: 'UI/UX Product Design Intern',
    requiredSkills: ['UI/UX', 'JavaScript'],
    location: 'Remote',
    workMode: 'Remote',
    duration: '4 Months',
    stipend: '₹30,000 / month',
    postedDate: 'Just now',
    description: 'Craft beautiful design systems, responsive layouts, and user journeys for international SaaS client apps.',
    eligibilityRequirements: ['Strong visual portfolio in Figma', 'Understanding of basic frontend layout concepts'],
    applicantsCount: 8
  }
];

export const initialApplications: Application[] = [
  {
    id: 'app_1',
    internshipId: 'intern_1',
    studentId: 'std_1',
    studentName: 'Alex Morgan',
    studentEmail: 'alex.student@example.com',
    studentCollege: 'IIT Bombay',
    studentBranch: 'Computer Science',
    studentYear: '3rd Year',
    appliedDate: '2026-08-29',
    status: 'Shortlisted',
    matchPercentage: 85,
    matchingSkills: ['Python', 'JavaScript', 'SQL'],
    missingSkills: [],
    studentSkillScores: {
      'Python': 82,
      'JavaScript': 75,
      'SQL': 80,
      'React': 65
    }
  },
  {
    id: 'app_2',
    internshipId: 'intern_2',
    studentId: 'std_1',
    studentName: 'Alex Morgan',
    studentEmail: 'alex.student@example.com',
    studentCollege: 'IIT Bombay',
    studentBranch: 'Computer Science',
    studentYear: '3rd Year',
    appliedDate: '2026-08-30',
    status: 'Under Review',
    matchPercentage: 78,
    matchingSkills: ['Python', 'SQL'],
    missingSkills: ['Data Science'],
    studentSkillScores: {
      'Python': 82,
      'JavaScript': 75,
      'SQL': 80,
      'React': 65
    }
  }
];
