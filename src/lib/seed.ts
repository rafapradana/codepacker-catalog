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
        bg_hex: '#3B82F6',
        border_hex: '#2563EB',
        text_hex: '#FFFFFF'
      },
      {
        name: 'Mobile Application',
        bg_hex: '#10B981',
        border_hex: '#059669',
        text_hex: '#FFFFFF'
      },
      {
        name: 'Desktop Application',
        bg_hex: '#8B5CF6',
        border_hex: '#7C3AED',
        text_hex: '#FFFFFF'
      },
      {
        name: 'Game',
        bg_hex: '#F59E0B',
        border_hex: '#D97706',
        text_hex: '#FFFFFF'
      },
      {
        name: 'CLI Tool',
        bg_hex: '#6B7280',
        border_hex: '#4B5563',
        text_hex: '#FFFFFF'
      }
    ]).returning();

    // Create skills
    console.log('💪 Creating skills...');
    const skillsData = await db.insert(skills).values([
      {
        name: 'JavaScript',
        bg_hex: '#F7DF1E',
        border_hex: '#F7DF1E',
        text_hex: '#000000'
      },
      {
        name: 'TypeScript',
        bg_hex: '#3178C6',
        border_hex: '#3178C6',
        text_hex: '#FFFFFF'
      },
      {
        name: 'React',
        bg_hex: '#61DAFB',
        border_hex: '#61DAFB',
        text_hex: '#000000'
      },
      {
        name: 'Node.js',
        bg_hex: '#339933',
        border_hex: '#339933',
        text_hex: '#FFFFFF'
      },
      {
        name: 'Python',
        bg_hex: '#3776AB',
        border_hex: '#3776AB',
        text_hex: '#FFFFFF'
      },
      {
        name: 'PHP',
        bg_hex: '#777BB4',
        border_hex: '#777BB4',
        text_hex: '#FFFFFF'
      },
      {
        name: 'Java',
        bg_hex: '#ED8B00',
        border_hex: '#ED8B00',
        text_hex: '#FFFFFF'
      },
      {
        name: 'UI/UX Design',
        bg_hex: '#FF5722',
        border_hex: '#FF5722',
        text_hex: '#FFFFFF'
      }
    ]).returning();

    // Create tech stacks
    console.log('🛠️ Creating tech stacks...');
    const techstacksData = await db.insert(techstacks).values([
      {
        name: 'Next.js',
        bg_hex: '#000000',
        border_hex: '#000000',
        text_hex: '#FFFFFF'
      },
      {
        name: 'React',
        bg_hex: '#61DAFB',
        border_hex: '#61DAFB',
        text_hex: '#000000'
      },
      {
        name: 'Vue.js',
        bg_hex: '#4FC08D',
        border_hex: '#4FC08D',
        text_hex: '#FFFFFF'
      },
      {
        name: 'Laravel',
        bg_hex: '#FF2D20',
        border_hex: '#FF2D20',
        text_hex: '#FFFFFF'
      },
      {
        name: 'Express.js',
        bg_hex: '#000000',
        border_hex: '#000000',
        text_hex: '#FFFFFF'
      },
      {
        name: 'PostgreSQL',
        bg_hex: '#336791',
        border_hex: '#336791',
        text_hex: '#FFFFFF'
      },
      {
        name: 'MySQL',
        bg_hex: '#4479A1',
        border_hex: '#4479A1',
        text_hex: '#FFFFFF'
      },
      {
        name: 'TailwindCSS',
        bg_hex: '#06B6D4',
        border_hex: '#06B6D4',
        text_hex: '#FFFFFF'
      },
      {
        name: 'Flutter',
        bg_hex: '#02569B',
        border_hex: '#02569B',
        text_hex: '#FFFFFF'
      },
      {
        name: 'React Native',
        bg_hex: '#61DAFB',
        border_hex: '#61DAFB',
        text_hex: '#000000'
      }
    ]).returning();

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await db.insert(users).values({
      username: 'admin',
      email: 'admin@smkn4malang.sch.id',
      password_hash: adminPassword,
      role: 'admin'
    }).returning();

    await db.insert(admins).values({
      user_id: adminUser[0].id,
      full_name: 'Administrator'
    });

    // Create sample student user
    console.log('🎓 Creating sample student...');
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentUser = await db.insert(users).values({
      username: 'johndoe',
      email: 'john.doe@student.smkn4malang.sch.id',
      password_hash: studentPassword,
      role: 'student'
    }).returning();

    await db.insert(students).values({
      user_id: studentUser[0].id,
      full_name: 'John Doe',
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