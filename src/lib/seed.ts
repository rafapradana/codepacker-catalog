import { db } from './db';
import { 
  users, classes, students, admins, categories, skills, techstacks, gradingMetrics,
  projects, studentSkills, projectTechstacks, projectMedia, studentFollows, 
  projectLikes, projectLikeHistory
} from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create classes
    console.log('📚 Creating classes...');
    const classesData = await db.insert(classes).values([
      { name: 'XII RPL A' },
      { name: 'XII RPL B' },
      { name: 'XI RPL A' },
      { name: 'XI RPL B' },
      { name: 'X RPL A' },
      { name: 'X RPL B' },
    ]).returning();

    // Create categories
    console.log('🏷️ Creating categories...');
    const categoriesData = await db.insert(categories).values([
      {
        name: 'Web Application',
        bgHex: '#3B82F6',
        borderHex: '#2563EB',
        textHex: '#FFFFFF'
      },
      {
        name: 'Mobile Application',
        bgHex: '#10B981',
        borderHex: '#059669',
        textHex: '#FFFFFF'
      },
      {
        name: 'Desktop Application',
        bgHex: '#8B5CF6',
        borderHex: '#7C3AED',
        textHex: '#FFFFFF'
      },
      {
        name: 'Game',
        bgHex: '#F59E0B',
        borderHex: '#D97706',
        textHex: '#FFFFFF'
      },
      {
        name: 'CLI Tool',
        bgHex: '#6B7280',
        borderHex: '#4B5563',
        textHex: '#FFFFFF'
      }
    ]).returning();

    // Create skills
    console.log('💪 Creating skills...');
    const skillsData = await db.insert(skills).values([
      {
        name: 'JavaScript',
        bgHex: '#F7DF1E',
        borderHex: '#F7DF1E',
        textHex: '#000000'
      },
      {
        name: 'TypeScript',
        bgHex: '#3178C6',
        borderHex: '#3178C6',
        textHex: '#FFFFFF'
      },
      {
        name: 'React',
        bgHex: '#61DAFB',
        borderHex: '#61DAFB',
        textHex: '#000000'
      },
      {
        name: 'Node.js',
        bgHex: '#339933',
        borderHex: '#339933',
        textHex: '#FFFFFF'
      },
      {
        name: 'Python',
        bgHex: '#3776AB',
        borderHex: '#3776AB',
        textHex: '#FFFFFF'
      },
      {
        name: 'PHP',
        bgHex: '#777BB4',
        borderHex: '#777BB4',
        textHex: '#FFFFFF'
      },
      {
        name: 'Java',
        bgHex: '#ED8B00',
        borderHex: '#ED8B00',
        textHex: '#FFFFFF'
      },
      {
        name: 'UI/UX Design',
        bgHex: '#FF5722',
        borderHex: '#FF5722',
        textHex: '#FFFFFF'
      }
    ]).returning();

    // Create tech stacks
    console.log('🛠️ Creating tech stacks...');
    const techstacksData = await db.insert(techstacks).values([
      {
        name: 'Next.js',
        bgHex: '#000000',
        borderHex: '#000000',
        textHex: '#FFFFFF'
      },
      {
        name: 'React',
        bgHex: '#61DAFB',
        borderHex: '#61DAFB',
        textHex: '#000000'
      },
      {
        name: 'Vue.js',
        bgHex: '#4FC08D',
        borderHex: '#4FC08D',
        textHex: '#FFFFFF'
      },
      {
        name: 'Laravel',
        bgHex: '#FF2D20',
        borderHex: '#FF2D20',
        textHex: '#FFFFFF'
      },
      {
        name: 'Express.js',
        bgHex: '#000000',
        borderHex: '#000000',
        textHex: '#FFFFFF'
      },
      {
        name: 'PostgreSQL',
        bgHex: '#336791',
        borderHex: '#336791',
        textHex: '#FFFFFF'
      },
      {
        name: 'MySQL',
        bgHex: '#4479A1',
        borderHex: '#4479A1',
        textHex: '#FFFFFF'
      },
      {
        name: 'TailwindCSS',
        bgHex: '#06B6D4',
        borderHex: '#06B6D4',
        textHex: '#FFFFFF'
      },
      {
        name: 'Flutter',
        bgHex: '#02569B',
        borderHex: '#02569B',
        textHex: '#FFFFFF'
      },
      {
        name: 'React Native',
        bgHex: '#61DAFB',
        borderHex: '#61DAFB',
        textHex: '#000000'
      }
    ]).returning();

    // Create grading metrics
    console.log('📊 Creating grading metrics...');
    const gradingMetricsData = await db.insert(gradingMetrics).values([
      {
        name: 'Technical Implementation',
        description: 'Kualitas kode (clean code, struktur, naming convention), penggunaan teknologi yang tepat, kompleksitas teknis yang diterapkan',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'User Interface/User Experience',
        description: 'Desain visual yang menarik, kemudahan penggunaan (usability), responsiveness di berbagai device',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Functionality',
        description: 'Kelengkapan fitur sesuai requirement, fitur berjalan dengan baik tanpa bug, edge case handling',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Code Quality',
        description: 'Struktur folder dan file yang rapi, dokumentasi kode (comments, README), best practices programming',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Innovation & Creativity',
        description: 'Keunikan ide atau pendekatan, problem solving yang kreatif, value proposition yang jelas',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Performance',
        description: 'Loading speed, optimasi resource, scalability consideration',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Security',
        description: 'Input validation, authentication/authorization (jika ada), data protection',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Documentation',
        description: 'README yang lengkap, setup instructions yang jelas, API documentation (jika ada)',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Deployment & Accessibility',
        description: 'Project bisa diakses online, setup deployment yang proper, URL yang working',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Presentation & Communication',
        description: 'Kemampuan explain project, demo yang smooth, storytelling yang baik',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      }
    ]).returning();

    // Create admin user
    console.log('👤 Creating admin users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUsers = await db.insert(users).values([
      {
        username: 'admin',
        email: 'admin@smkn4malang.sch.id',
        passwordHash: adminPassword,
        role: 'admin'
      },
      {
        username: 'guru_pembimbing',
        email: 'guru.pembimbing@smkn4malang.sch.id',
        passwordHash: adminPassword,
        role: 'admin'
      }
    ]).returning();

    const adminsData = await db.insert(admins).values([
      {
        userId: adminUsers[0].id,
        fullName: 'Administrator SMKN 4 Malang'
      },
      {
        userId: adminUsers[1].id,
        fullName: 'Guru Pembimbing RPL'
      }
    ]).returning();

    // Create multiple student users
    console.log('🎓 Creating student users...');
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentUsers = await db.insert(users).values([
      {
        username: 'johndoe',
        email: 'john.doe@student.smkn4malang.sch.id',
        passwordHash: studentPassword,
        role: 'student'
      },
      {
        username: 'janedoe',
        email: 'jane.doe@student.smkn4malang.sch.id',
        passwordHash: studentPassword,
        role: 'student'
      },
      {
        username: 'alexsmith',
        email: 'alex.smith@student.smkn4malang.sch.id',
        passwordHash: studentPassword,
        role: 'student'
      },
      {
        username: 'sarahwilson',
        email: 'sarah.wilson@student.smkn4malang.sch.id',
        passwordHash: studentPassword,
        role: 'student'
      },
      {
        username: 'mikejohnson',
        email: 'mike.johnson@student.smkn4malang.sch.id',
        passwordHash: studentPassword,
        role: 'student'
      },
      {
        username: 'emilybrown',
        email: 'emily.brown@student.smkn4malang.sch.id',
        passwordHash: studentPassword,
        role: 'student'
      }
    ]).returning();

    const studentsData = await db.insert(students).values([
      {
        userId: studentUsers[0].id,
        fullName: 'John Doe',
        bio: 'Passionate full-stack developer with experience in modern web technologies. Love creating innovative solutions.',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        githubUrl: 'https://github.com/johndoe',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        classId: classesData[0].id // XII RPL A
      },
      {
        userId: studentUsers[1].id,
        fullName: 'Jane Doe',
        bio: 'Frontend specialist focusing on React and modern UI/UX design. Always eager to learn new technologies.',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        githubUrl: 'https://github.com/janedoe',
        linkedinUrl: 'https://linkedin.com/in/janedoe',
        classId: classesData[0].id // XII RPL A
      },
      {
        userId: studentUsers[2].id,
        fullName: 'Alex Smith',
        bio: 'Backend developer with expertise in Node.js and database design. Interested in system architecture.',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        githubUrl: 'https://github.com/alexsmith',
        linkedinUrl: 'https://linkedin.com/in/alexsmith',
        classId: classesData[1].id // XII RPL B
      },
      {
        userId: studentUsers[3].id,
        fullName: 'Sarah Wilson',
        bio: 'Mobile app developer specializing in Flutter and React Native. Love creating cross-platform solutions.',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        githubUrl: 'https://github.com/sarahwilson',
        linkedinUrl: 'https://linkedin.com/in/sarahwilson',
        classId: classesData[2].id // XI RPL A
      },
      {
        userId: studentUsers[4].id,
        fullName: 'Mike Johnson',
        bio: 'Game developer and creative coder. Passionate about interactive experiences and game mechanics.',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        githubUrl: 'https://github.com/mikejohnson',
        linkedinUrl: 'https://linkedin.com/in/mikejohnson',
        classId: classesData[3].id // XI RPL B
      },
      {
        userId: studentUsers[5].id,
        fullName: 'Emily Brown',
        bio: 'DevOps enthusiast and cloud computing specialist. Focus on automation and scalable infrastructure.',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        githubUrl: 'https://github.com/emilybrown',
        linkedinUrl: 'https://linkedin.com/in/emilybrown',
        classId: classesData[4].id // X RPL A
      }
    ]).returning();

    // Create projects with thumbnails
    console.log('📁 Creating projects...');
    const projectsData = await db.insert(projects).values([
      {
        studentId: studentsData[0].id, // John Doe
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce platform with modern UI, payment integration, and admin dashboard. Features include product catalog, shopping cart, user authentication, and order management.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/johndoe/ecommerce-platform',
        liveDemoUrl: 'https://ecommerce-demo.johndoe.dev',
        categoryId: categoriesData[0].id // Web Application
      },
      {
        studentId: studentsData[0].id, // John Doe
        title: 'Task Management API',
        description: 'RESTful API for task management with authentication, real-time notifications, and team collaboration features. Built with Node.js and PostgreSQL.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/johndoe/task-api',
        liveDemoUrl: 'https://task-api.johndoe.dev',
        categoryId: categoriesData[0].id // Web Application
      },
      {
        studentId: studentsData[1].id, // Jane Doe
        title: 'Portfolio Website',
        description: 'Modern portfolio website with smooth animations, responsive design, and dark mode support. Showcases projects and skills with interactive elements.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/janedoe/portfolio',
        liveDemoUrl: 'https://janedoe.dev',
        categoryId: categoriesData[0].id // Web Application
      },
      {
        studentId: studentsData[1].id, // Jane Doe
        title: 'Weather Dashboard',
        description: 'Interactive weather dashboard with location-based forecasts, charts, and weather maps. Features clean UI and real-time data updates.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/janedoe/weather-dashboard',
        liveDemoUrl: 'https://weather.janedoe.dev',
        categoryId: categoriesData[0].id // Web Application
      },
      {
        studentId: studentsData[2].id, // Alex Smith
        title: 'Inventory Management System',
        description: 'Desktop application for inventory management with barcode scanning, reporting, and multi-user support. Built with Electron and SQLite.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/alexsmith/inventory-system',
        categoryId: categoriesData[2].id // Desktop Application
      },
      {
        studentId: studentsData[2].id, // Alex Smith
        title: 'Chat Application',
        description: 'Real-time chat application with rooms, file sharing, and emoji support. Features WebSocket communication and message encryption.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/alexsmith/chat-app',
        liveDemoUrl: 'https://chat.alexsmith.dev',
        categoryId: categoriesData[0].id // Web Application
      },
      {
        studentId: studentsData[3].id, // Sarah Wilson
        title: 'Fitness Tracker App',
        description: 'Mobile fitness tracking app with workout plans, progress tracking, and social features. Cross-platform solution with offline support.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/sarahwilson/fitness-tracker',
        categoryId: categoriesData[1].id // Mobile Application
      },
      {
        studentId: studentsData[3].id, // Sarah Wilson
        title: 'Recipe Sharing App',
        description: 'Social recipe sharing mobile app with photo uploads, rating system, and cooking timer. Features ingredient shopping list generation.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/sarahwilson/recipe-app',
        categoryId: categoriesData[1].id // Mobile Application
      },
      {
        studentId: studentsData[4].id, // Mike Johnson
        title: '2D Platformer Game',
        description: 'Retro-style 2D platformer game with pixel art graphics, multiple levels, and power-ups. Features physics engine and level editor.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/mikejohnson/platformer-game',
        liveDemoUrl: 'https://game.mikejohnson.dev',
        categoryId: categoriesData[3].id // Game
      },
      {
        studentId: studentsData[4].id, // Mike Johnson
        title: 'Puzzle Game Collection',
        description: 'Collection of classic puzzle games with modern UI and multiplayer support. Includes Tetris, Sudoku, and custom puzzle variants.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/mikejohnson/puzzle-games',
        liveDemoUrl: 'https://puzzles.mikejohnson.dev',
        categoryId: categoriesData[3].id // Game
      },
      {
        studentId: studentsData[5].id, // Emily Brown
        title: 'DevOps Automation Tool',
        description: 'CLI tool for automating deployment pipelines and server management. Features Docker integration and configuration management.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/emilybrown/devops-tool',
        categoryId: categoriesData[4].id // CLI Tool
      },
      {
        studentId: studentsData[5].id, // Emily Brown
        title: 'Monitoring Dashboard',
        description: 'System monitoring dashboard with real-time metrics, alerting, and performance analytics. Built for cloud infrastructure monitoring.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/emilybrown/monitoring-dashboard',
        liveDemoUrl: 'https://monitor.emilybrown.dev',
        categoryId: categoriesData[0].id // Web Application
      }
    ]).returning();

    // Create student skills relationships
    console.log('💪 Creating student skills relationships...');
    await db.insert(studentSkills).values([
      // John Doe skills
      { studentId: studentsData[0].id, skillId: skillsData[0].id }, // JavaScript
      { studentId: studentsData[0].id, skillId: skillsData[1].id }, // TypeScript
      { studentId: studentsData[0].id, skillId: skillsData[2].id }, // React
      { studentId: studentsData[0].id, skillId: skillsData[3].id }, // Node.js
      
      // Jane Doe skills
      { studentId: studentsData[1].id, skillId: skillsData[0].id }, // JavaScript
      { studentId: studentsData[1].id, skillId: skillsData[1].id }, // TypeScript
      { studentId: studentsData[1].id, skillId: skillsData[2].id }, // React
      { studentId: studentsData[1].id, skillId: skillsData[7].id }, // UI/UX Design
      
      // Alex Smith skills
      { studentId: studentsData[2].id, skillId: skillsData[0].id }, // JavaScript
      { studentId: studentsData[2].id, skillId: skillsData[3].id }, // Node.js
      { studentId: studentsData[2].id, skillId: skillsData[4].id }, // Python
      
      // Sarah Wilson skills
      { studentId: studentsData[3].id, skillId: skillsData[0].id }, // JavaScript
      { studentId: studentsData[3].id, skillId: skillsData[1].id }, // TypeScript
      { studentId: studentsData[3].id, skillId: skillsData[7].id }, // UI/UX Design
      
      // Mike Johnson skills
      { studentId: studentsData[4].id, skillId: skillsData[0].id }, // JavaScript
      { studentId: studentsData[4].id, skillId: skillsData[4].id }, // Python
      { studentId: studentsData[4].id, skillId: skillsData[6].id }, // Java
      
      // Emily Brown skills
      { studentId: studentsData[5].id, skillId: skillsData[4].id }, // Python
      { studentId: studentsData[5].id, skillId: skillsData[3].id }, // Node.js
      { studentId: studentsData[5].id, skillId: skillsData[5].id }, // PHP
    ]);

    // Create project tech stacks relationships
    console.log('🛠️ Creating project tech stacks relationships...');
    await db.insert(projectTechstacks).values([
      // E-Commerce Platform (John's project)
      { projectId: projectsData[0].id, techstackId: techstacksData[0].id }, // Next.js
      { projectId: projectsData[0].id, techstackId: techstacksData[1].id }, // React
      { projectId: projectsData[0].id, techstackId: techstacksData[5].id }, // PostgreSQL
      { projectId: projectsData[0].id, techstackId: techstacksData[7].id }, // TailwindCSS
      
      // Task Management API (John's project)
      { projectId: projectsData[1].id, techstackId: techstacksData[4].id }, // Express.js
      { projectId: projectsData[1].id, techstackId: techstacksData[5].id }, // PostgreSQL
      
      // Portfolio Website (Jane's project)
      { projectId: projectsData[2].id, techstackId: techstacksData[0].id }, // Next.js
      { projectId: projectsData[2].id, techstackId: techstacksData[1].id }, // React
      { projectId: projectsData[2].id, techstackId: techstacksData[7].id }, // TailwindCSS
      
      // Weather Dashboard (Jane's project)
      { projectId: projectsData[3].id, techstackId: techstacksData[1].id }, // React
      { projectId: projectsData[3].id, techstackId: techstacksData[7].id }, // TailwindCSS
      
      // Inventory Management System (Alex's project)
      { projectId: projectsData[4].id, techstackId: techstacksData[4].id }, // Express.js
      { projectId: projectsData[4].id, techstackId: techstacksData[6].id }, // MySQL
      
      // Chat Application (Alex's project)
      { projectId: projectsData[5].id, techstackId: techstacksData[4].id }, // Express.js
      { projectId: projectsData[5].id, techstackId: techstacksData[1].id }, // React
      { projectId: projectsData[5].id, techstackId: techstacksData[5].id }, // PostgreSQL
      
      // Fitness Tracker App (Sarah's project)
      { projectId: projectsData[6].id, techstackId: techstacksData[8].id }, // Flutter
      
      // Recipe Sharing App (Sarah's project)
      { projectId: projectsData[7].id, techstackId: techstacksData[9].id }, // React Native
      
      // 2D Platformer Game (Mike's project)
      { projectId: projectsData[8].id, techstackId: techstacksData[0].id }, // Next.js (web version)
      
      // Puzzle Game Collection (Mike's project)
      { projectId: projectsData[9].id, techstackId: techstacksData[1].id }, // React
      { projectId: projectsData[9].id, techstackId: techstacksData[7].id }, // TailwindCSS
      
      // DevOps Automation Tool (Emily's project)
      { projectId: projectsData[10].id, techstackId: techstacksData[4].id }, // Express.js
      
      // Monitoring Dashboard (Emily's project)
      { projectId: projectsData[11].id, techstackId: techstacksData[2].id }, // Vue.js
      { projectId: projectsData[11].id, techstackId: techstacksData[5].id }, // PostgreSQL
    ]);

    // Create project media
    console.log('📸 Creating project media...');
    await db.insert(projectMedia).values([
      { projectId: projectsData[0].id, mediaUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d', mediaType: 'image' },
      { projectId: projectsData[0].id, mediaUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3', mediaType: 'image' },
      { projectId: projectsData[1].id, mediaUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71', mediaType: 'image' },
      { projectId: projectsData[2].id, mediaUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d', mediaType: 'image' },
      { projectId: projectsData[3].id, mediaUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b', mediaType: 'image' },
      { projectId: projectsData[4].id, mediaUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07', mediaType: 'image' },
      { projectId: projectsData[5].id, mediaUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624', mediaType: 'image' },
      { projectId: projectsData[6].id, mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', mediaType: 'image' },
      { projectId: projectsData[7].id, mediaUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136', mediaType: 'image' },
      { projectId: projectsData[8].id, mediaUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8', mediaType: 'image' },
      { projectId: projectsData[9].id, mediaUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5', mediaType: 'image' },
      { projectId: projectsData[10].id, mediaUrl: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a', mediaType: 'image' },
      { projectId: projectsData[11].id, mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', mediaType: 'image' },
    ]);

    // Create student follows for testing follow system
    console.log('👥 Creating student follows...');
    await db.insert(studentFollows).values([
      { followerId: studentsData[0].id, followingId: studentsData[1].id }, // John follows Jane
      { followerId: studentsData[0].id, followingId: studentsData[2].id }, // John follows Alex
      { followerId: studentsData[1].id, followingId: studentsData[0].id }, // Jane follows John
      { followerId: studentsData[1].id, followingId: studentsData[3].id }, // Jane follows Sarah
      { followerId: studentsData[2].id, followingId: studentsData[0].id }, // Alex follows John
      { followerId: studentsData[2].id, followingId: studentsData[4].id }, // Alex follows Mike
      { followerId: studentsData[3].id, followingId: studentsData[1].id }, // Sarah follows Jane
      { followerId: studentsData[3].id, followingId: studentsData[5].id }, // Sarah follows Emily
      { followerId: studentsData[4].id, followingId: studentsData[2].id }, // Mike follows Alex
      { followerId: studentsData[5].id, followingId: studentsData[3].id }, // Emily follows Sarah
    ]);

    // Create project likes for testing like system
    console.log('❤️ Creating project likes...');
    await db.insert(projectLikes).values([
      { projectId: projectsData[0].id, studentId: studentsData[1].id }, // Jane likes John's E-Commerce
      { projectId: projectsData[0].id, studentId: studentsData[2].id }, // Alex likes John's E-Commerce
      { projectId: projectsData[0].id, studentId: studentsData[3].id }, // Sarah likes John's E-Commerce
      { projectId: projectsData[2].id, studentId: studentsData[0].id }, // John likes Jane's Portfolio
      { projectId: projectsData[2].id, studentId: studentsData[4].id }, // Mike likes Jane's Portfolio
      { projectId: projectsData[4].id, studentId: studentsData[1].id }, // Jane likes Alex's Inventory System
      { projectId: projectsData[6].id, studentId: studentsData[2].id }, // Alex likes Sarah's Fitness App
      { projectId: projectsData[8].id, studentId: studentsData[0].id }, // John likes Mike's Game
      { projectId: projectsData[8].id, studentId: studentsData[3].id }, // Sarah likes Mike's Game
      { projectId: projectsData[10].id, studentId: studentsData[4].id }, // Mike likes Emily's DevOps Tool
    ]);

    // Create project like history for testing
    console.log('📊 Creating project like history...');
    await db.insert(projectLikeHistory).values([
      { projectId: projectsData[0].id, studentId: studentsData[1].id, action: 'like' },
      { projectId: projectsData[0].id, studentId: studentsData[2].id, action: 'like' },
      { projectId: projectsData[0].id, studentId: studentsData[3].id, action: 'like' },
      { projectId: projectsData[2].id, studentId: studentsData[0].id, action: 'like' },
      { projectId: projectsData[2].id, studentId: studentsData[4].id, action: 'like' },
      { projectId: projectsData[4].id, studentId: studentsData[1].id, action: 'like' },
      { projectId: projectsData[6].id, studentId: studentsData[2].id, action: 'like' },
      { projectId: projectsData[8].id, studentId: studentsData[0].id, action: 'like' },
      { projectId: projectsData[8].id, studentId: studentsData[3].id, action: 'like' },
      { projectId: projectsData[10].id, studentId: studentsData[4].id, action: 'like' },
      // Some unlike actions for testing
      { projectId: projectsData[1].id, studentId: studentsData[2].id, action: 'like' },
      { projectId: projectsData[1].id, studentId: studentsData[2].id, action: 'unlike' },
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Created:');
    console.log(`   - ${classesData.length} classes`);
    console.log(`   - ${categoriesData.length} categories`);
    console.log(`   - ${skillsData.length} skills`);
    console.log(`   - ${techstacksData.length} tech stacks`);
    console.log(`   - ${gradingMetricsData.length} grading metrics`);
    console.log(`   - ${adminsData.length} admin users`);
    console.log(`   - ${studentsData.length} student users`);
    console.log(`   - ${projectsData.length} projects`);
    console.log(`   - Student skills relationships`);
    console.log(`   - Project tech stacks relationships`);
    console.log(`   - Project media files`);
    console.log(`   - Student follows relationships`);
    console.log(`   - Project likes and like history`);
    console.log('🎉 Ready for testing!');

    // Summary statistics
    console.log('\n📈 Summary Statistics:');
    console.log(`   - Total users: ${adminsData.length + studentsData.length}`);
    console.log(`   - Total projects: ${projectsData.length}`);
    console.log(`   - Projects with live demos: ${projectsData.filter(p => p.liveDemoUrl).length}`);
    console.log(`   - Total project likes: 10`);
    console.log(`   - Total student follows: 10`);
    console.log(`   - Projects per category:`);
    console.log(`     • Web Applications: ${projectsData.filter(p => p.categoryId === categoriesData[0].id).length}`);
    console.log(`     • Mobile Applications: ${projectsData.filter(p => p.categoryId === categoriesData[1].id).length}`);
    console.log(`     • Desktop Applications: ${projectsData.filter(p => p.categoryId === categoriesData[2].id).length}`);
    console.log(`     • Games: ${projectsData.filter(p => p.categoryId === categoriesData[3].id).length}`);
    console.log(`     • CLI Tools: ${projectsData.filter(p => p.categoryId === categoriesData[4].id).length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('🎉 Seeding process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  });