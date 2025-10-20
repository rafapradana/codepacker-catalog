import { db } from '@/lib/db';
import { 
  students, 
  projects, 
  categories, 
  skills, 
  techstacks, 
  classes,
  projectAssessments,
  projectLikes,
  projectTechstacks,
  projectMedia,
  users
} from '@/lib/schema';
import { sql, count, desc, asc, avg, sum, isNotNull, eq, and, gte, lte } from 'drizzle-orm';

export interface EnhancedDashboardStats {
  // Basic counts
  totalStudents: number;
  totalProjects: number;
  totalCategories: number;
  totalSkills: number;
  totalTechstacks: number;
  totalClasses: number;

  // Performance & Quality Metrics
  assessmentStats: {
    averageScore: number;
    totalAssessed: number;
    totalUnassessed: number;
    assessmentRate: number;
  };

  // Engagement Metrics
  engagementStats: {
    totalLikes: number;
    averageLikesPerProject: number;
    mostLikedProject: {
      id: string;
      title: string;
      likes: number;
    } | null;
  };

  // Project Completion Stats
  completionStats: {
    withGithub: number;
    withDemo: number;
    withThumbnail: number;
    fullyComplete: number;
    completionRate: number;
  };

  // Recent Activity
  recentProjects: Array<{
    id: string;
    title: string;
    studentName: string;
    createdAt: Date;
    thumbnailUrl: string | null;
    category: {
      name: string;
      bgHex: string;
      borderHex: string;
      textHex: string;
    } | null;
  }>;

  // Top Categories with enhanced data
  topCategories: Array<{
    name: string;
    projectCount: number;
    bgHex: string;
    borderHex: string;
    textHex: string;
    averageScore: number | null;
    totalLikes: number;
  }>;

  // Top Tech Stacks
  topTechStacks: Array<{
    name: string;
    projectCount: number;
    bgHex: string;
    borderHex: string;
    textHex: string;
    iconUrl: string | null;
  }>;

  // Class Performance
  classPerformance: Array<{
    className: string;
    studentCount: number;
    projectCount: number;
    averageScore: number | null;
    totalLikes: number;
  }>;

  // Projects needing attention
  projectsNeedingAttention: {
    unassessed: number;
    incomplete: number;
    lowScore: number;
  };

  // Monthly trends (last 6 months)
  monthlyTrends: Array<{
    month: string;
    projectsCreated: number;
    assessmentsCompleted: number;
    averageScore: number | null;
  }>;
}

export async function getEnhancedDashboardStats(): Promise<EnhancedDashboardStats> {
  try {
    // Get basic counts
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

    // Assessment statistics
    const assessmentStats = await db
      .select({
        totalAssessed: count(projectAssessments.id),
        averageScore: avg(projectAssessments.totalScore),
      })
      .from(projectAssessments);

    const totalProjects = projectsCount[0]?.count || 0;
    const totalAssessed = assessmentStats[0]?.totalAssessed || 0;
    const totalUnassessed = totalProjects - totalAssessed;

    // Engagement statistics
    const engagementStats = await db
      .select({
        totalLikes: count(projectLikes.id),
      })
      .from(projectLikes);

    const mostLikedProject = await db
      .select({
        id: projects.id,
        title: projects.title,
        likes: count(projectLikes.id),
      })
      .from(projects)
      .leftJoin(projectLikes, eq(projects.id, projectLikes.projectId))
      .groupBy(projects.id, projects.title)
      .orderBy(desc(count(projectLikes.id)))
      .limit(1);

    // Project completion statistics
    const completionStats = await db
      .select({
        withGithub: sum(sql`CASE WHEN ${projects.githubUrl} IS NOT NULL AND ${projects.githubUrl} != '' THEN 1 ELSE 0 END`),
        withDemo: sum(sql`CASE WHEN ${projects.liveDemoUrl} IS NOT NULL AND ${projects.liveDemoUrl} != '' THEN 1 ELSE 0 END`),
        withThumbnail: sum(sql`CASE WHEN ${projects.thumbnailUrl} IS NOT NULL AND ${projects.thumbnailUrl} != '' THEN 1 ELSE 0 END`),
        fullyComplete: sum(sql`CASE WHEN ${projects.githubUrl} IS NOT NULL AND ${projects.githubUrl} != '' AND ${projects.liveDemoUrl} IS NOT NULL AND ${projects.liveDemoUrl} != '' AND ${projects.thumbnailUrl} IS NOT NULL AND ${projects.thumbnailUrl} != '' THEN 1 ELSE 0 END`),
      })
      .from(projects);

    // Recent projects with enhanced data
    const recentProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        studentName: students.fullName,
        createdAt: projects.createdAt,
        thumbnailUrl: projects.thumbnailUrl,
        categoryName: categories.name,
        categoryBgHex: categories.bgHex,
        categoryBorderHex: categories.borderHex,
        categoryTextHex: categories.textHex,
      })
      .from(projects)
      .leftJoin(students, eq(projects.studentId, students.id))
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .orderBy(desc(projects.createdAt))
      .limit(5);

    // Top categories with enhanced metrics
    const topCategories = await db
      .select({
        name: categories.name,
        projectCount: count(projects.id),
        bgHex: categories.bgHex,
        borderHex: categories.borderHex,
        textHex: categories.textHex,
        averageScore: avg(projectAssessments.totalScore),
        totalLikes: count(projectLikes.id),
      })
      .from(categories)
      .leftJoin(projects, eq(categories.id, projects.categoryId))
      .leftJoin(projectAssessments, eq(projects.id, projectAssessments.projectId))
      .leftJoin(projectLikes, eq(projects.id, projectLikes.projectId))
      .groupBy(categories.id, categories.name, categories.bgHex, categories.borderHex, categories.textHex)
      .orderBy(desc(count(projects.id)))
      .limit(5);

    // Top tech stacks
    const topTechStacks = await db
      .select({
        name: techstacks.name,
        projectCount: count(projectTechstacks.id),
        bgHex: techstacks.bgHex,
        borderHex: techstacks.borderHex,
        textHex: techstacks.textHex,
        iconUrl: techstacks.iconUrl,
      })
      .from(techstacks)
      .leftJoin(projectTechstacks, eq(techstacks.id, projectTechstacks.techstackId))
      .groupBy(techstacks.id, techstacks.name, techstacks.bgHex, techstacks.borderHex, techstacks.textHex, techstacks.iconUrl)
      .orderBy(desc(count(projectTechstacks.id)))
      .limit(5);

    // Class performance
    const classPerformance = await db
      .select({
        className: classes.name,
        studentCount: count(sql`DISTINCT ${students.id}`),
        projectCount: count(projects.id),
        averageScore: avg(projectAssessments.totalScore),
        totalLikes: count(projectLikes.id),
      })
      .from(classes)
      .leftJoin(students, eq(classes.id, students.classId))
      .leftJoin(projects, eq(students.id, projects.studentId))
      .leftJoin(projectAssessments, eq(projects.id, projectAssessments.projectId))
      .leftJoin(projectLikes, eq(projects.id, projectLikes.projectId))
      .groupBy(classes.id, classes.name)
      .orderBy(desc(avg(projectAssessments.totalScore)));

    // Projects needing attention
    const unassessedCount = await db
      .select({ count: count() })
      .from(projects)
      .leftJoin(projectAssessments, eq(projects.id, projectAssessments.projectId))
      .where(sql`${projectAssessments.id} IS NULL`);

    const incompleteCount = await db
      .select({ count: count() })
      .from(projects)
      .where(sql`${projects.githubUrl} IS NULL OR ${projects.githubUrl} = '' OR ${projects.liveDemoUrl} IS NULL OR ${projects.liveDemoUrl} = ''`);

    const lowScoreCount = await db
      .select({ count: count() })
      .from(projectAssessments)
      .where(sql`${projectAssessments.totalScore} < 70`);

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await db
      .select({
        month: sql<string>`TO_CHAR(${projects.createdAt}, 'YYYY-MM')`,
        projectsCreated: count(projects.id),
        assessmentsCompleted: count(projectAssessments.id),
        averageScore: avg(projectAssessments.totalScore),
      })
      .from(projects)
      .leftJoin(projectAssessments, eq(projects.id, projectAssessments.projectId))
      .where(gte(projects.createdAt, sixMonthsAgo))
      .groupBy(sql`TO_CHAR(${projects.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${projects.createdAt}, 'YYYY-MM')`);

    return {
      totalStudents: studentsCount[0]?.count || 0,
      totalProjects: totalProjects,
      totalCategories: categoriesCount[0]?.count || 0,
      totalSkills: skillsCount[0]?.count || 0,
      totalTechstacks: techstacksCount[0]?.count || 0,
      totalClasses: classesCount[0]?.count || 0,

      assessmentStats: {
        averageScore: Number(assessmentStats[0]?.averageScore || 0),
        totalAssessed,
        totalUnassessed,
        assessmentRate: totalProjects > 0 ? (totalAssessed / totalProjects) * 100 : 0,
      },

      engagementStats: {
        totalLikes: engagementStats[0]?.totalLikes || 0,
        averageLikesPerProject: totalProjects > 0 ? (engagementStats[0]?.totalLikes || 0) / totalProjects : 0,
        mostLikedProject: mostLikedProject[0] ? {
          id: mostLikedProject[0].id,
          title: mostLikedProject[0].title,
          likes: mostLikedProject[0].likes,
        } : null,
      },

      completionStats: {
        withGithub: Number(completionStats[0]?.withGithub || 0),
        withDemo: Number(completionStats[0]?.withDemo || 0),
        withThumbnail: Number(completionStats[0]?.withThumbnail || 0),
        fullyComplete: Number(completionStats[0]?.fullyComplete || 0),
        completionRate: totalProjects > 0 ? (Number(completionStats[0]?.fullyComplete || 0) / totalProjects) * 100 : 0,
      },

      recentProjects: recentProjects.map(project => ({
        ...project,
        studentName: project.studentName || 'Unknown Student',
        category: project.categoryName ? {
          name: project.categoryName,
          bgHex: project.categoryBgHex || '#f3f4f6',
          borderHex: project.categoryBorderHex || '#d1d5db',
          textHex: project.categoryTextHex || '#374151',
        } : null,
      })),

      topCategories: topCategories.map(category => ({
        ...category,
        projectCount: Number(category.projectCount),
        averageScore: category.averageScore ? Number(category.averageScore) : null,
        totalLikes: Number(category.totalLikes),
      })),

      topTechStacks: topTechStacks.map(techstack => ({
        ...techstack,
        projectCount: Number(techstack.projectCount),
      })),

      classPerformance: classPerformance.map(cls => ({
        ...cls,
        studentCount: Number(cls.studentCount),
        projectCount: Number(cls.projectCount),
        averageScore: cls.averageScore ? Number(cls.averageScore) : null,
        totalLikes: Number(cls.totalLikes),
      })),

      projectsNeedingAttention: {
        unassessed: unassessedCount[0]?.count || 0,
        incomplete: incompleteCount[0]?.count || 0,
        lowScore: lowScoreCount[0]?.count || 0,
      },

      monthlyTrends: monthlyTrends.map(trend => ({
        ...trend,
        projectsCreated: Number(trend.projectsCreated),
        assessmentsCompleted: Number(trend.assessmentsCompleted),
        averageScore: trend.averageScore ? Number(trend.averageScore) : null,
      })),
    };
  } catch (error) {
    console.error('Error fetching enhanced dashboard stats:', error);
    // Return empty stats structure
    return {
      totalStudents: 0,
      totalProjects: 0,
      totalCategories: 0,
      totalSkills: 0,
      totalTechstacks: 0,
      totalClasses: 0,
      assessmentStats: {
        averageScore: 0,
        totalAssessed: 0,
        totalUnassessed: 0,
        assessmentRate: 0,
      },
      engagementStats: {
        totalLikes: 0,
        averageLikesPerProject: 0,
        mostLikedProject: null,
      },
      completionStats: {
        withGithub: 0,
        withDemo: 0,
        withThumbnail: 0,
        fullyComplete: 0,
        completionRate: 0,
      },
      recentProjects: [],
      topCategories: [],
      topTechStacks: [],
      classPerformance: [],
      projectsNeedingAttention: {
        unassessed: 0,
        incomplete: 0,
        lowScore: 0,
      },
      monthlyTrends: [],
    };
  }
}