import { db } from '@/lib/db';
import { students, projects, categories, skills, techstacks, classes } from '@/lib/schema';
import { sql, count, desc } from 'drizzle-orm';

export interface DashboardStats {
  totalStudents: number;
  totalProjects: number;
  totalCategories: number;
  totalSkills: number;
  totalTechstacks: number;
  totalClasses: number;
  recentProjects: Array<{
    id: string;
    title: string;
    studentName: string;
    createdAt: Date;
    viewsInternal: number;
    viewsExternal: number;
  }>;
  topCategories: Array<{
    name: string;
    projectCount: number;
    bgHex: string;
    borderHex: string;
    textHex: string;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total counts
    const [
      studentsCount,
      projectsCount,
      categoriesCount,
      skillsCount,
      techstacksCount,
      classesCount
    ] = await Promise.all([
      db.select({ count: count() }).from(students),
      db.select({ count: count() }).from(projects),
      db.select({ count: count() }).from(categories),
      db.select({ count: count() }).from(skills),
      db.select({ count: count() }).from(techstacks),
      db.select({ count: count() }).from(classes)
    ]);

    // Get recent projects with student names
    const recentProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        studentName: students.fullName,
        createdAt: projects.createdAt,
        viewsInternal: projects.viewsInternal,
        viewsExternal: projects.viewsExternal,
      })
      .from(projects)
      .leftJoin(students, sql`${projects.studentId} = ${students.id}`)
      .orderBy(desc(projects.createdAt))
      .limit(5);

    // Get top categories by project count
    const topCategories = await db
      .select({
        name: categories.name,
        projectCount: count(projects.id),
        bgHex: categories.bgHex,
        borderHex: categories.borderHex,
        textHex: categories.textHex,
      })
      .from(categories)
      .leftJoin(projects, sql`${categories.id} = ${projects.categoryId}`)
      .groupBy(categories.id, categories.name, categories.bgHex, categories.borderHex, categories.textHex)
      .orderBy(desc(count(projects.id)))
      .limit(5);

    return {
      totalStudents: studentsCount[0]?.count || 0,
      totalProjects: projectsCount[0]?.count || 0,
      totalCategories: categoriesCount[0]?.count || 0,
      totalSkills: skillsCount[0]?.count || 0,
      totalTechstacks: techstacksCount[0]?.count || 0,
      totalClasses: classesCount[0]?.count || 0,
      recentProjects: recentProjects.map(project => ({
        ...project,
        studentName: project.studentName || 'Unknown Student'
      })),
      topCategories: topCategories.map(category => ({
        ...category,
        projectCount: Number(category.projectCount)
      }))
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalStudents: 0,
      totalProjects: 0,
      totalCategories: 0,
      totalSkills: 0,
      totalTechstacks: 0,
      totalClasses: 0,
      recentProjects: [],
      topCategories: []
    };
  }
}