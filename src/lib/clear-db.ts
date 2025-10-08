import { db } from './db';
import { users, classes, students, admins, categories, skills, techstacks, projects, project_techstacks, project_media, student_skills, session, account, verification } from './schema';

async function clearDatabase() {
  console.log('🧹 Clearing database...');

  try {
    // Delete in reverse order of dependencies
    await db.delete(student_skills);
    await db.delete(project_media);
    await db.delete(project_techstacks);
    await db.delete(projects);
    await db.delete(students);
    await db.delete(admins);
    await db.delete(session);
    await db.delete(account);
    await db.delete(verification);
    await db.delete(users);
    await db.delete(techstacks);
    await db.delete(skills);
    await db.delete(categories);
    await db.delete(classes);

    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

// Run the clear function
clearDatabase()
  .then(() => {
    console.log('🎉 Database clearing completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database clearing failed:', error);
    process.exit(1);
  });