import { db } from './db';
import { users, classes, students, admins, categories, skills, techstacks } from './schema';
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

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await db.insert(users).values({
      username: 'admin',
      email: 'admin@smkn4malang.sch.id',
      passwordHash: adminPassword,
      role: 'admin'
    }).returning();

    await db.insert(admins).values({
      userId: adminUser[0].id,
      fullName: 'Administrator'
    });

    // Create sample student user
    console.log('🎓 Creating sample student...');
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentUser = await db.insert(users).values({
      username: 'johndoe',
      email: 'john.doe@student.smkn4malang.sch.id',
      passwordHash: studentPassword,
      role: 'student'
    }).returning();

    await db.insert(students).values({
      userId: studentUser[0].id,
      fullName: 'John Doe',
      bio: 'Passionate full-stack developer with experience in modern web technologies.',
      githubUrl: 'https://github.com/johndoe',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      classId: classesData[0].id
    });

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Created:');
    console.log(`   - ${classesData.length} classes`);
    console.log(`   - ${categoriesData.length} categories`);
    console.log(`   - ${skillsData.length} skills`);
    console.log(`   - ${techstacksData.length} tech stacks`);
    console.log('   - 1 admin user (admin/admin123)');
    console.log('   - 1 student user (johndoe/student123)');

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