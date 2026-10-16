import { StudentProfile, CompanyProfile, AdminProfile, Course, Quiz, Internship, Application, ShowcasePost } from '../types';

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
      'Data Science': 40,
      'TypeScript': 55,
      'AWS': 30,
      'Docker': 35
    },
    enrolledCourses: ['course_1', 'course_3', 'course_6'],
    completedCourses: ['course_4'],
    quizScores: {
      'quiz_python': 85,
      'quiz_sql': 80,
      'quiz_js': 75,
      'quiz_react': 82
    },
    bio: 'Passionate developer focusing on scalable web applications and algorithmic data structures. Building products that solve real-world problems.',
    githubUrl: 'https://github.com/alexmorgan',
    linkedinUrl: 'https://linkedin.com/in/alexmorgan',
    streak: 0
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
      'SQL': 78,
      'Pandas': 85,
      'NumPy': 80,
      'Scikit-Learn': 75,
      'TensorFlow': 45,
      'Data Visualization': 82
    },
    enrolledCourses: ['course_2', 'course_7'],
    completedCourses: ['course_2'],
    quizScores: {
      'quiz_python': 92,
      'quiz_ds': 88,
      'quiz_ml': 85
    },
    bio: 'Machine learning & data analytics researcher. Published 2 papers on predictive modeling. Seeking ML engineering internship.',
    githubUrl: 'https://github.com/sophiachen',
    linkedinUrl: 'https://linkedin.com/in/sophiachen',
    streak: 0
  },
  {
    id: 'std_3',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@student.edu',
    college: 'NIT Trichy',
    degree: 'B.Tech',
    branch: 'Computer Science',
    year: '2nd Year',
    location: 'Chennai, India',
    skills: {
      'JavaScript': 70,
      'React': 60,
      'HTML/CSS': 85,
      'TypeScript': 55,
      'Node.js': 50,
      'Git': 75,
      'REST APIs': 45
    },
    enrolledCourses: ['course_1', 'course_4', 'course_8'],
    completedCourses: [],
    quizScores: {
      'quiz_js': 72,
      'quiz_react': 68
    },
    bio: 'Frontend enthusiast building responsive web apps. Active in open source. Love creating delightful user experiences.',
    githubUrl: 'https://github.com/rahulsharma',
    linkedinUrl: 'https://linkedin.com/in/rahulsharma',
    streak: 0
  },
  {
    id: 'std_4',
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    college: 'VIT Vellore',
    degree: 'B.Tech',
    branch: 'Electronics & Communication',
    year: '3rd Year',
    location: 'Delhi, India',
    skills: {
      'Python': 75,
      'C++': 70,
      'Embedded Systems': 65,
      'IoT': 55,
      'MATLAB': 60,
      'Signal Processing': 50,
      'Data Structures': 80
    },
    enrolledCourses: ['course_2', 'course_9'],
    completedCourses: ['course_9'],
    quizScores: {
      'quiz_python': 78,
      'quiz_cpp': 75
    },
    bio: 'ECE student exploring software development. Strong algorithmic foundation. Transitioning to full-stack development.',
    githubUrl: 'https://github.com/priyapatel',
    linkedinUrl: 'https://linkedin.com/in/priyapatel',
    streak: 0
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
      { id: 'l1', title: 'React 19 Hooks & Component Architecture', duration: '45 mins', videoUrl: 'https://www.youtube.com/embed/gY5sGvq-8h8' }
    ]
  },
  {
    id: 'course_14',
    title: 'Node.js & Express Backend Development',
    description: 'Build scalable REST APIs with Node.js, Express, MongoDB, authentication, and deployment. Master backend architecture from fundamentals to production.',
    instructor: 'Ryan Dahl (Node.js Creator)',
    skill: 'Node.js',
    difficulty: 'Intermediate',
    duration: '28 Hours',
    rating: 4.9,
    studentsCount: 5200,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l141', title: 'Building RESTful APIs with Node & Express', duration: '60 mins', videoUrl: 'https://www.youtube.com/embed/BLl32FvcdVM' },
      { id: 'l142', title: 'Full-Stack Project Deployment', duration: '40 mins', videoUrl: 'https://www.youtube.com/embed/AZzV3wZCvI4' }
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
      { id: 'l21', title: 'Python Fundamentals & Data Structures', duration: '50 mins', videoUrl: 'https://www.youtube.com/embed/UrsmFxEIp5k' },
      { id: 'l22', title: 'Data Cleaning & Manipulation with Pandas', duration: '65 mins', videoUrl: 'https://www.youtube.com/embed/t2_Q2BRzeEE' },
      { id: 'l23', title: 'Supervised Learning & Regression Models', duration: '75 mins', videoUrl: 'https://www.youtube.com/embed/s5MJpRBQLgo' },
      { id: 'l24', title: 'Model Evaluation & Hyperparameter Tuning', duration: '60 mins', videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc' }
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
      { id: 'l31', title: 'Relational Schema Design & Normalization', duration: '40 mins', videoUrl: 'https://www.youtube.com/embed/SSKVgrwhzus' },
      { id: 'l32', title: 'Advanced Window Functions & Subqueries', duration: '50 mins', videoUrl: 'https://www.youtube.com/embed/7S_tz1z_5bA' }
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
      { id: 'l41', title: 'Promises, Async/Await & Event Loop', duration: '55 mins', videoUrl: 'https://www.youtube.com/embed/ajdRvxDWH4w' },
      { id: 'l42', title: 'Modules & Functional Programming Patterns', duration: '50 mins', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' }
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
      { id: 'l51', title: 'Design Principles & Auto Layout in Figma', duration: '40 mins', videoUrl: 'https://www.youtube.com/embed/truRwcI7-kg' },
      { id: 'l52', title: 'Building Component Libraries & Tokens', duration: '50 mins', videoUrl: 'https://www.youtube.com/embed/O5IXf8qB9U4' }
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
      { id: 'l61', title: 'Docker Containers & Docker Compose', duration: '60 mins', videoUrl: 'https://www.youtube.com/embed/dmGybCohHsw' },
      { id: 'l62', title: 'AWS EC2, S3 & CloudFront Setup', duration: '70 mins', videoUrl: 'https://www.youtube.com/embed/70oYrSnRgoI' }
    ]
  },
  {
    id: 'course_7',
    title: 'Advanced Machine Learning with TensorFlow & PyTorch',
    description: 'Deep learning fundamentals, neural network architectures, computer vision, NLP transformers, and model deployment.',
    instructor: 'Dr. Andrew Ng (Stanford Adjunct Professor)',
    skill: 'Machine Learning',
    difficulty: 'Advanced',
    duration: '35 Hours',
    rating: 4.9,
    studentsCount: 2200,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80',
lessons: [
      { id: 'l71', title: 'Neural Networks & Backpropagation', duration: '65 mins', videoUrl: 'https://www.youtube.com/embed/1L420xXpDTg' },
      { id: 'l72', title: 'CNNs for Computer Vision', duration: '70 mins', videoUrl: 'https://www.youtube.com/embed/Lb0JzFtTmBs' }
    ]
  },
  {
    id: 'course_8',
    title: 'TypeScript Mastery: From Basics to Advanced Patterns',
    description: 'Type-safe JavaScript development. Generics, utility types, conditional types, decorators, and compiler configuration.',
    instructor: 'Anders Hejlsberg (TypeScript Creator)',
    skill: 'TypeScript',
    difficulty: 'Intermediate',
    duration: '20 Hours',
    rating: 4.8,
    studentsCount: 2600,
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l81', title: 'Type System Fundamentals & Type Inference', duration: '50 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l82', title: 'Generics, Utility Types & Mapped Types', duration: '60 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l83', title: 'Advanced Patterns: Decorators, Brands, Template Literals', duration: '55 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]
  },
  {
    id: 'course_9',
    title: 'C++ for Competitive Programming & Systems',
    description: 'High-performance C++17/20. STL mastery, memory management, templates, concurrency, and algorithmic problem solving.',
    instructor: 'Dennis Ritchie Fellow (Systems Engineer)',
    skill: 'C++',
    difficulty: 'Intermediate',
    duration: '22 Hours',
    rating: 4.7,
    studentsCount: 1800,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l91', title: 'STL Containers, Algorithms & Iterators', duration: '60 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l92', title: 'Memory Management, Smart Pointers & RAII', duration: '55 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l93', title: 'Concurrency: Threads, Atomics & Lock-free', duration: '65 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]
  },
  {
    id: 'course_10',
    title: 'Cybersecurity Fundamentals & Ethical Hacking',
    description: 'Network security, web vulnerabilities (OWASP Top 10), penetration testing methodology, and secure coding practices.',
    instructor: 'Kevin Mitnick (Security Consultant)',
    skill: 'Cybersecurity',
    difficulty: 'Beginner',
    duration: '25 Hours',
    rating: 4.8,
    studentsCount: 1600,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l101', title: 'Network Protocols & Reconnaissance', duration: '50 mins', videoUrl: 'https://www.youtube.com/embed/v3iUx2SNspY' },
      { id: 'l102', title: 'Web App Vulnerabilities: XSS, CSRF, SQLi', duration: '65 mins', videoUrl: 'https://www.youtube.com/embed/u1gKcQkdmNw' }
    ]
  },
  {
    id: 'course_13',
    title: 'Java Programming Masterclass: From Basics to Advanced',
    description: 'Master Java 17+ with hands-on projects. Learn OOP, collections, streams, multithreading, Spring Boot basics, and build production-ready applications.',
    instructor: 'James Gosling (Java Creator)',
    skill: 'Java',
    difficulty: 'Beginner',
    duration: '40 Hours',
    rating: 4.9,
    studentsCount: 8500,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l131', title: 'Java Fundamentals & Object-Oriented Programming', duration: '90 mins', videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34' },
      { id: 'l132', title: 'Advanced Java: Collections, Streams & Multithreading', duration: '110 mins', videoUrl: 'https://www.youtube.com/embed/LBqE4YOvhyc' }
    ]
  },
  {
    id: 'course_14',
    title: 'Data Science with Python: Visualization & Feature Engineering',
    description: 'Master data visualization with Seaborn & Matplotlib, and build robust feature engineering pipelines for machine learning models.',
    instructor: 'Dr. Sarah Jenkins (AI Researcher)',
    skill: 'Data Science',
    difficulty: 'Intermediate',
    duration: '8 Hours',
    rating: 4.8,
    studentsCount: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    lessons: [
      { id: 'l141', title: 'Data Visualization with Seaborn & Matplotlib', duration: '55 mins', videoUrl: 'https://www.youtube.com/embed/sWhqqiJuypA' },
      { id: 'l142', title: 'Feature Engineering & Preprocessing Pipelines', duration: '65 mins', videoUrl: 'https://www.youtube.com/embed/ppYbY-LbqiI' }
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
  },
  'TypeScript': {
    id: 'quiz_typescript',
    skill: 'TypeScript',
    title: 'TypeScript Advanced Type System Assessment',
    passingScore: 75,
    questions: [
      {
        id: 'q_ts1',
        text: 'What does the `never` type represent in TypeScript?',
        options: ['A type that can be any value', 'A type that represents the absence of any value', 'A type for values that never occur (e.g., functions that always throw)', 'A type alias for null'],
        correctIndex: 2,
        explanation: 'The `never` type represents values that never occur. Functions that always throw or have infinite loops have a return type of `never`.'
      },
      {
        id: 'q_ts2',
        text: 'Which utility type makes all properties of a type optional?',
        options: ['Required<T>', 'Partial<T>', 'Pick<T, K>', 'Omit<T, K>'],
        correctIndex: 1,
        explanation: 'Partial<T> constructs a type with all properties of T set to optional.'
      }
    ]
  },
  'Machine Learning': {
    id: 'quiz_ml',
    skill: 'Machine Learning',
    title: 'Machine Learning Fundamentals & Model Evaluation',
    passingScore: 70,
    questions: [
      {
        id: 'q_ml1',
        text: 'What is the difference between supervised and unsupervised learning?',
        options: [
          'Supervised uses labeled data, unsupervised uses unlabeled data',
          'Supervised is faster, unsupervised is slower',
          'Supervised only works with images, unsupervised works with text',
          'There is no difference'
        ],
        correctIndex: 0,
        explanation: 'Supervised learning trains on labeled input-output pairs. Unsupervised learning finds patterns in unlabeled data.'
      },
      {
        id: 'q_ml2',
        text: 'Which metric is best for evaluating a model on imbalanced classification?',
        options: ['Accuracy', 'Precision', 'F1-Score', 'Mean Squared Error'],
        correctIndex: 2,
        explanation: 'F1-Score (harmonic mean of precision and recall) is robust for imbalanced datasets.'
      }
    ]
  },
  'C++': {
    id: 'quiz_cpp',
    skill: 'C++',
    title: 'C++ Memory Management & STL Proficiency',
    passingScore: 70,
    questions: [
      {
        id: 'q_cpp1',
        text: 'What does RAII stand for in C++?',
        options: [
          'Resource Allocation Is Initialization',
          'Runtime Automatic Initialization Interface',
          'Recursive Algorithm Implementation Iteration',
          'Reference Argument Instantiation Idiom'
        ],
        correctIndex: 0,
        explanation: 'RAII (Resource Acquisition Is Initialization) binds resource lifecycle to object lifetime.'
      },
      {
        id: 'q_cpp2',
        text: 'Which smart pointer allows shared ownership?',
        options: ['unique_ptr', 'shared_ptr', 'weak_ptr', 'auto_ptr'],
        correctIndex: 1,
        explanation: 'shared_ptr uses reference counting to enable shared ownership of a resource.'
      }
    ]
  },
  'Cloud Computing': {
    id: 'quiz_cloud',
    skill: 'Cloud Computing',
    title: 'Cloud Architecture & DevOps Competency',
    passingScore: 70,
    questions: [
      {
        id: 'q_cl1',
        text: 'What is the primary benefit of using Infrastructure as Code (IaC)?',
        options: [
          'Reduces cloud costs automatically',
          'Enables version-controlled, reproducible infrastructure deployments',
          'Eliminates the need for monitoring',
          'Automatically scales applications'
        ],
        correctIndex: 1,
        explanation: 'IaC allows infrastructure to be defined in code, enabling version control, reproducibility, and automation.'
      },
      {
        id: 'q_cl2',
        text: 'Which AWS service provides managed Kubernetes?',
        options: ['ECS', 'EKS', 'Lambda', 'Fargate'],
        correctIndex: 1,
        explanation: 'Amazon EKS (Elastic Kubernetes Service) is a managed Kubernetes service.'
      }
    ]
  },
  'UI/UX': {
    id: 'quiz_uiux',
    skill: 'UI/UX',
    title: 'User Experience Design & Research Assessment',
    passingScore: 70,
    questions: [
      {
        id: 'q_ux1',
        text: 'What is the purpose of a design system?',
        options: [
          'To create beautiful animations',
          'To ensure consistency, scalability, and efficiency across products',
          'To replace developers',
          'To store design files only'
        ],
        correctIndex: 1,
        explanation: 'Design systems provide reusable components, guidelines, and tokens for consistent product experiences.'
      }
    ]
  },
  'Cybersecurity': {
    id: 'quiz_cyber',
    skill: 'Cybersecurity',
    title: 'Web Application Security & Penetration Testing',
    passingScore: 75,
    questions: [
      {
        id: 'q_cb1',
        text: 'Which OWASP Top 10 vulnerability allows attackers to inject malicious SQL queries?',
        options: ['XSS', 'CSRF', 'SQL Injection', 'Broken Authentication'],
        correctIndex: 2,
        explanation: 'SQL Injection occurs when untrusted input is concatenated into SQL queries without parameterization.'
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
  },
  {
    id: 'intern_5',
    companyId: 'comp_3',
    companyName: 'CloudScale Systems',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    position: 'DevOps & Cloud Engineering Intern',
    requiredSkills: ['Docker', 'AWS', 'Kubernetes', 'Linux', 'CI/CD'],
    location: 'Pune, India',
    workMode: 'Hybrid',
    duration: '5 Months',
    stipend: '₹38,000 / month',
    postedDate: '1 week ago',
    description: 'Automate infrastructure provisioning, build CI/CD pipelines, and manage Kubernetes clusters for microservices.',
    eligibilityRequirements: ['Linux fundamentals', 'Basic Docker knowledge', 'Interest in cloud-native technologies'],
    applicantsCount: 11
  },
  {
    id: 'intern_6',
    companyId: 'comp_2',
    companyName: 'DataPulse Analytics',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
    position: 'Data Engineering Intern',
    requiredSkills: ['Python', 'SQL', 'Data Engineering', 'ETL', 'Apache Spark'],
    location: 'Hyderabad, India',
    workMode: 'Remote',
    duration: '4 Months',
    stipend: '₹42,000 / month',
    postedDate: '2 days ago',
    description: 'Build scalable data pipelines, optimize ETL workflows, and maintain data lake architecture on cloud platforms.',
    eligibilityRequirements: ['Strong Python & SQL', 'Familiarity with big data concepts', 'Experience with Airflow/Spark a plus'],
    applicantsCount: 15
  },
  {
    id: 'intern_7',
    companyId: 'comp_4',
    companyName: 'Nexus UI Studio',
    companyLogo: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=150&auto=format&fit=crop&q=80',
    position: 'Frontend Developer Intern (React/Next.js)',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Git'],
    location: 'Remote',
    workMode: 'Remote',
    duration: '6 Months',
    stipend: '₹32,000 / month',
    postedDate: '5 days ago',
    description: 'Build performant, accessible web applications using Next.js 15 App Router, Server Components, and modern React patterns.',
    eligibilityRequirements: ['React & TypeScript proficiency', 'Portfolio with Next.js projects', 'Understanding of SSR/SSG'],
    applicantsCount: 25
  },
  {
    id: 'intern_8',
    companyId: 'comp_1',
    companyName: 'TechCorp Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80',
    position: 'Backend Engineering Intern (Node.js/Go)',
    requiredSkills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Microservices', 'GraphQL'],
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    duration: '6 Months',
    stipend: '₹48,000 / month',
    postedDate: '4 days ago',
    description: 'Design and implement scalable microservices, GraphQL APIs, and real-time systems for high-traffic products.',
    eligibilityRequirements: ['Strong backend fundamentals', 'Experience with Node.js or Go', 'Database design knowledge'],
    applicantsCount: 17
  },
  {
    id: 'intern_9',
    companyId: 'comp_3',
    companyName: 'CloudScale Systems',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    position: 'Site Reliability Engineering (SRE) Intern',
    requiredSkills: ['Linux', 'Prometheus', 'Grafana', 'Kubernetes', 'Go', 'Python', 'Observability'],
    location: 'Pune, India',
    workMode: 'On-site',
    duration: '6 Months',
    stipend: '₹40,000 / month',
    postedDate: '1 day ago',
    description: 'Ensure system reliability through monitoring, alerting, incident response, and capacity planning for production clusters.',
    eligibilityRequirements: ['Linux system administration', 'Monitoring tools experience', 'Scripting in Python/Go'],
    applicantsCount: 9
  },
  {
    id: 'intern_10',
    companyId: 'comp_4',
    companyName: 'Nexus UI Studio',
    companyLogo: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=150&auto=format&fit=crop&q=80',
    position: 'Mobile App Development Intern (React Native)',
    requiredSkills: ['React Native', 'TypeScript', 'Expo', 'Redux', 'Mobile UI/UX'],
    location: 'Remote',
    workMode: 'Remote',
    duration: '5 Months',
    stipend: '₹35,000 / month',
    postedDate: '3 days ago',
    description: 'Develop cross-platform mobile applications with React Native, Expo, and native module integrations.',
    eligibilityRequirements: ['React Native experience', 'JavaScript/TypeScript proficiency', 'Published app a plus'],
    applicantsCount: 13
  },
  {
    id: 'intern_11',
    companyId: 'comp_2',
    companyName: 'DataPulse Analytics',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
    position: 'MLOps Engineer Intern',
    requiredSkills: ['Python', 'Docker', 'Kubernetes', 'MLflow', 'MLOps', 'CI/CD', 'AWS/GCP'],
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    duration: '6 Months',
    stipend: '₹50,000 / month',
    postedDate: '2 days ago',
    description: 'Build ML model deployment pipelines, experiment tracking, model monitoring, and automated retraining workflows.',
    eligibilityRequirements: ['ML model lifecycle knowledge', 'Containerization experience', 'Cloud platform familiarity'],
    applicantsCount: 7
  },
  {
    id: 'intern_12',
    companyId: 'comp_1',
    companyName: 'TechCorp Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80',
    position: 'Cybersecurity Intern (AppSec)',
    requiredSkills: ['Security', 'Penetration Testing', 'OWASP', 'Burp Suite', 'Python', 'JavaScript'],
    location: 'Bengaluru, India',
    workMode: 'On-site',
    duration: '4 Months',
    stipend: '₹38,000 / month',
    postedDate: '1 week ago',
    description: 'Perform security assessments, code reviews, threat modeling, and vulnerability remediation for web applications.',
    eligibilityRequirements: ['Security fundamentals', 'OWASP Top 10 knowledge', 'CTF or bug bounty experience a plus'],
    applicantsCount: 6
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
  },
  {
    id: 'app_3',
    internshipId: 'intern_3',
    studentId: 'std_1',
    studentName: 'Alex Morgan',
    studentEmail: 'alex.student@example.com',
    studentCollege: 'IIT Bombay',
    studentBranch: 'Computer Science',
    studentYear: '3rd Year',
    appliedDate: '2026-08-28',
    status: 'Applied',
    matchPercentage: 82,
    matchingSkills: ['Python', 'React', 'SQL'],
    missingSkills: ['Node.js'],
    studentSkillScores: {
      'Python': 82,
      'JavaScript': 75,
      'SQL': 80,
      'React': 65,
      'Node.js': 50
    }
  },
  {
    id: 'app_4',
    internshipId: 'intern_1',
    studentId: 'std_2',
    studentName: 'Sophia Chen',
    studentEmail: 'sophia@example.com',
    studentCollege: 'BITS Pilani',
    studentBranch: 'Information Systems',
    studentYear: '4th Year',
    appliedDate: '2026-08-29',
    status: 'Under Review',
    matchPercentage: 72,
    matchingSkills: ['JavaScript', 'SQL'],
    missingSkills: ['React'],
    studentSkillScores: {
      'Python': 90,
      'Data Science': 88,
      'Machine Learning': 82,
      'SQL': 78
    }
  },
  {
    id: 'app_5',
    internshipId: 'intern_2',
    studentId: 'std_2',
    studentName: 'Sophia Chen',
    studentEmail: 'sophia@example.com',
    studentCollege: 'BITS Pilani',
    studentBranch: 'Information Systems',
    studentYear: '4th Year',
    appliedDate: '2026-08-30',
    status: 'Shortlisted',
    matchPercentage: 95,
    matchingSkills: ['Python', 'Data Science', 'SQL'],
    missingSkills: [],
    studentSkillScores: {
      'Python': 90,
      'Data Science': 88,
      'Machine Learning': 82,
      'SQL': 78
    }
  },
  {
    id: 'app_6',
    internshipId: 'intern_4',
    studentId: 'std_3',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@student.edu',
    studentCollege: 'NIT Trichy',
    studentBranch: 'Computer Science',
    studentYear: '2nd Year',
    appliedDate: '2026-08-31',
    status: 'Applied',
    matchPercentage: 68,
    matchingSkills: ['JavaScript'],
    missingSkills: ['UI/UX'],
    studentSkillScores: {
      'JavaScript': 70,
      'React': 60,
      'HTML/CSS': 85,
      'TypeScript': 55
    }
  },
  {
    id: 'app_7',
    internshipId: 'intern_7',
    studentId: 'std_3',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@student.edu',
    studentCollege: 'NIT Trichy',
    studentBranch: 'Computer Science',
    studentYear: '2nd Year',
    appliedDate: '2026-09-01',
    status: 'Applied',
    matchPercentage: 85,
    matchingSkills: ['React', 'TypeScript', 'JavaScript'],
    missingSkills: ['Next.js', 'Tailwind CSS'],
    studentSkillScores: {
      'JavaScript': 70,
      'React': 60,
      'HTML/CSS': 85,
      'TypeScript': 55
    }
  },
  {
    id: 'app_8',
    internshipId: 'intern_2',
    studentId: 'std_4',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@university.edu',
    studentCollege: 'VIT Vellore',
    studentBranch: 'Electronics & Communication',
    studentYear: '3rd Year',
    appliedDate: '2026-09-02',
    status: 'Applied',
    matchPercentage: 75,
    matchingSkills: ['Python', 'SQL'],
    missingSkills: ['Data Science'],
    studentSkillScores: {
      'Python': 75,
      'C++': 70,
      'Data Structures': 80
    }
  }
];

export const initialPosts: ShowcasePost[] = [
  {
    id: 'post_1',
    authorId: 'std_1',
    authorName: 'Alex Morgan',
    authorRole: 'student',
    authorCollege: 'IIT Bombay',
    authorBranch: 'Computer Science',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bioHeadline: '3rd Year CS Student @ IIT Bombay | Full-Stack Web Architecture Specialist',
    content: 'Extremely thrilled to share that I just completed the "Advanced React & Web Architecture" certification on SkillBridge! Spent 4 weeks building scalable micro-frontends and optimizing state management. Huge thanks to the SkillBridge ecosystem for the hands-on project verification!',
    postType: 'certificate',
    certificates: [
      {
        id: 'cert_101',
        title: 'Advanced React & Web Architecture',
        issuer: 'SkillBridge Ecosystem',
        date: 'Sept 2026',
        isVerified: true
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
    ],
    tags: ['React', 'WebDev', 'Certificate', 'Frontend'],
    likesCount: 24,
    likedBy: ['std_2', 'comp_1'],
    comments: [
      {
        id: 'comm_1',
        authorName: 'Sophia Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Congratulations Alex! Super inspiring work on the React architecture projects.',
        createdAt: '2 hours ago'
      }
    ],
    createdAt: '1 day ago'
  },
  {
    id: 'post_2',
    authorId: 'std_2',
    authorName: 'Sophia Chen',
    authorRole: 'student',
    authorCollege: 'BITS Pilani',
    authorBranch: 'Information Systems',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bioHeadline: 'Data Analytics & ML Researcher | BITS Pilani 4th Year',
    content: 'Wrapped up a fantastic data science project analyzing real-time predictive models using Python, Pandas, and SQL. Sharing a glance of our dataset insights and automated dashboard metrics!',
    postType: 'experience',
    certificates: [],
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    ],
    tags: ['DataScience', 'Python', 'MachineLearning', 'InternshipExperience'],
    likesCount: 38,
    likedBy: ['std_1'],
    comments: [],
    createdAt: '2 days ago'
  }
];

