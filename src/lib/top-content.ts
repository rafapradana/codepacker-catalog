import { db } from './db';
import { 
  projects, 
  students, 
  classes, 
  categories, 
  projectAssessments, 
  projectLikes, 
  studentFollows,
  users,
  skills,
  studentSkills,
  projectTechstacks,
  techstacks,
  projectMedia
} from './schema';
import { eq, desc, sql, count, avg, sum, isNotNull } from 'drizzle-orm';

export interface TopProject {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  githubUrl: string;
  liveDemoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  score: number;
  student: {
    id: string;
    fullName: string;
    profilePhotoUrl: string | null;
    classId: string | null;
    className: string | null;
  };
  category: {
    id: string;
    name: string;
    bgHex: string;
    borderHex: string;
    textHex: string;
  } | null;
  projectTechstacks: Array<{
    id: string;
    techstack: {
      id: string;
      name: string;
      iconUrl: string | null;
      bgHex: string;
      borderHex: string;
      textHex: string;
    };
  }>;
  projectMedia: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
  }>;
  likeCount: number;
  assessmentScore: number | null;
}

export interface TopStudent {
  id: string;
  fullName: string;
  bio: string | null;
  profilePhotoUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  score: number;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  } | null;
  class: {
    id: string;
    name: string;
  } | null;
  skills: Array<{
    id: string;
    name: string;
    iconUrl: string | null;
    bgHex: string;
    borderHex: string;
    textHex: string;
  }>;
  projectCount: number;
  avgAssessmentScore: number | null;
  totalLikes: number;
  followingCount: number;
  followerCount: number;
}

// Calculate recency score (newer projects get higher scores)
function calculateRecencyScore(createdAt: Date): number {
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // Projects within 30 days get full score, then decay
  if (daysDiff <= 30) return 100;
  if (daysDiff <= 90) return 80;
  if (daysDiff <= 180) return 60;
  if (daysDiff <= 365) return 40;
  return 20;
}

// Calculate completeness score for projects
function calculateProjectCompleteness(project: any): number {
  let score = 0;
  if (project.description) score += 20;
  if (project.thumbnailUrl) score += 20;
  if (project.liveDemoUrl) score += 20;
  if (project.techstackCount > 0) score += 20;
  if (project.mediaCount > 0) score += 20;
  return score;
}

// Calculate completeness score for student profiles
function calculateProfileCompleteness(student: any): number {
  let score = 0;
  if (student.bio) score += 20;
  if (student.profilePhotoUrl) score += 20;
  if (student.githubUrl) score += 20;
  if (student.linkedinUrl) score += 20;
  if (student.skillCount > 0) score += 20;
  return score;
}

// Get top 3 projects with scoring algorithm
export async function getTopProjects(): Promise<TopProject[]> {
  try {
    // First, get all projects with their related data
    const projectsData = await db
      .select({
        // Project fields
        id: projects.id,
        title: projects.title,
        description: projects.description,
        thumbnailUrl: projects.thumbnailUrl,
        githubUrl: projects.githubUrl,
        liveDemoUrl: projects.liveDemoUrl,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        // Student fields
        studentId: students.id,
        studentFullName: students.fullName,
        studentProfilePhotoUrl: students.profilePhotoUrl,
        studentClassId: students.classId,
        // Class fields
        className: classes.name,
        // Category fields
        categoryId: categories.id,
        categoryName: categories.name,
        categoryBgHex: categories.bgHex,
        categoryBorderHex: categories.borderHex,
        categoryTextHex: categories.textHex,
        // Assessment fields
        assessmentTotalScore: projectAssessments.totalScore,
        // Counts
        likeCount: sql<number>`COALESCE(${count(projectLikes.id)}, 0)`,
        techstackCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM ${projectTechstacks} 
          WHERE ${projectTechstacks.projectId} = ${projects.id}
        ), 0)`,
        mediaCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM ${projectMedia} 
          WHERE ${projectMedia.projectId} = ${projects.id}
        ), 0)`,
      })
      .from(projects)
      .innerJoin(students, eq(projects.studentId, students.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .leftJoin(projectAssessments, eq(projects.id, projectAssessments.projectId))
      .leftJoin(projectLikes, eq(projects.id, projectLikes.projectId))
      .groupBy(
        projects.id,
        students.id,
        classes.id,
        categories.id,
        projectAssessments.id
      );

    // Calculate scores for each project
    const scoredProjects = projectsData.map(project => {
      // 1. Assessment Score (40%)
      const assessmentScore = project.assessmentTotalScore ? (project.assessmentTotalScore / 100) * 100 : 0;
      
      // 2. Engagement Score (30%) - normalize likes
      const maxLikes = Math.max(...projectsData.map(p => p.likeCount), 1);
      const likesScore = Math.min((project.likeCount / maxLikes) * 100, 100);
      
      // 3. Recency Score (20%)
      const recencyScore = calculateRecencyScore(project.createdAt);
      
      // 4. Completeness Score (10%)
      const completenessScore = calculateProjectCompleteness(project);
      
      // Calculate final score
      const finalScore = (assessmentScore * 0.4) + (likesScore * 0.3) + 
                        (recencyScore * 0.2) + (completenessScore * 0.1);
      
      return {
        ...project,
        score: Math.round(finalScore * 100) / 100 // Round to 2 decimal places
      };
    });

    // Sort by score and take top 3
    const topProjects = scoredProjects
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Get detailed data for top projects including techstacks and media
    const detailedProjects = await Promise.all(
      topProjects.map(async (project) => {
        // Get techstacks
        const techstackData = await db
          .select({
            id: projectTechstacks.id,
            techstack: {
              id: techstacks.id,
              name: techstacks.name,
              iconUrl: techstacks.iconUrl,
              bgHex: techstacks.bgHex,
              borderHex: techstacks.borderHex,
              textHex: techstacks.textHex,
            }
          })
          .from(projectTechstacks)
          .innerJoin(techstacks, eq(projectTechstacks.techstackId, techstacks.id))
          .where(eq(projectTechstacks.projectId, project.id));

        // Get media
        const media = await db
          .select({
            id: projectMedia.id,
            mediaUrl: projectMedia.mediaUrl,
            mediaType: projectMedia.mediaType,
          })
          .from(projectMedia)
          .where(eq(projectMedia.projectId, project.id));

        return {
          id: project.id,
          title: project.title,
          description: project.description,
          thumbnailUrl: project.thumbnailUrl,
          githubUrl: project.githubUrl,
          liveDemoUrl: project.liveDemoUrl,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          score: project.score,
          student: {
            id: project.studentId,
            fullName: project.studentFullName,
            profilePhotoUrl: project.studentProfilePhotoUrl,
            classId: project.studentClassId,
            className: project.className,
          },
          category: project.categoryId ? {
            id: project.categoryId,
            name: project.categoryName!,
            bgHex: project.categoryBgHex!,
            borderHex: project.categoryBorderHex!,
            textHex: project.categoryTextHex!,
          } : null,
          projectTechstacks: techstackData,
          projectMedia: media,
          likeCount: project.likeCount,
          assessmentScore: project.assessmentTotalScore,
        };
      })
    );

    return detailedProjects;
  } catch (error) {
    console.error('Error fetching top projects:', error);
    return [];
  }
}

// Get top 3 students with scoring algorithm
export async function getTopStudents(): Promise<TopStudent[]> {
  try {
    // Get all students with their related data and calculated metrics
    const studentsData = await db
      .select({
        // Student fields
        id: students.id,
        fullName: students.fullName,
        bio: students.bio,
        profilePhotoUrl: students.profilePhotoUrl,
        githubUrl: students.githubUrl,
        linkedinUrl: students.linkedinUrl,
        classId: students.classId,
        // User fields
        userId: users.id,
        username: users.username,
        userEmail: users.email,
        userRole: users.role,
        // Class fields
        className: classes.name,
        // Calculated metrics
        projectCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM ${projects} 
          WHERE ${projects.studentId} = ${students.id}
        ), 0)`,
        avgAssessmentScore: sql<number>`COALESCE((
          SELECT AVG(${projectAssessments.totalScore}) 
          FROM ${projects} 
          LEFT JOIN ${projectAssessments} ON ${projects.id} = ${projectAssessments.projectId}
          WHERE ${projects.studentId} = ${students.id}
        ), 0)`,
        totalLikes: sql<number>`COALESCE((
          SELECT COUNT(*) FROM ${projectLikes} 
          JOIN ${projects} ON ${projectLikes.projectId} = ${projects.id}
          WHERE ${projects.studentId} = ${students.id}
        ), 0)`,
        followingCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM ${studentFollows} 
          WHERE ${studentFollows.followerId} = ${students.id}
        ), 0)`,
        followerCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM ${studentFollows} 
          WHERE ${studentFollows.followingId} = ${students.id}
        ), 0)`,
        skillCount: sql<number>`COALESCE((
          SELECT COUNT(*) FROM ${studentSkills} 
          WHERE ${studentSkills.studentId} = ${students.id}
        ), 0)`,
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id));

    // Calculate scores for each student
    const scoredStudents = studentsData.map(student => {
      // 1. Project Quality Score (50%) - average assessment score
      const projectQualityScore = student.avgAssessmentScore || 0;
      
      // 2. Activity Score (25%) - projects and engagement
      const activityScore = Math.min((student.projectCount * 20) + (student.totalLikes * 5), 100);
      
      // 3. Profile Completeness Score (15%)
      const profileScore = calculateProfileCompleteness(student);
      
      // 4. Social Score (10%) - followers and following
      const socialScore = Math.min((student.followerCount * 3) + (student.followingCount * 1), 100);
      
      // Calculate final score
      const finalScore = (projectQualityScore * 0.5) + (activityScore * 0.25) + 
                        (profileScore * 0.15) + (socialScore * 0.1);
      
      return {
        ...student,
        score: Math.round(finalScore * 100) / 100 // Round to 2 decimal places
      };
    });

    // Sort by score and take top 3
    const topStudents = scoredStudents
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Get detailed data for top students including skills
    const detailedStudents = await Promise.all(
      topStudents.map(async (student) => {
        // Get skills
        const studentSkillsData = await db
          .select({
            id: skills.id,
            name: skills.name,
            iconUrl: skills.iconUrl,
            bgHex: skills.bgHex,
            borderHex: skills.borderHex,
            textHex: skills.textHex,
          })
          .from(studentSkills)
          .innerJoin(skills, eq(studentSkills.skillId, skills.id))
          .where(eq(studentSkills.studentId, student.id));

        return {
          id: student.id,
          fullName: student.fullName,
          bio: student.bio,
          profilePhotoUrl: student.profilePhotoUrl,
          githubUrl: student.githubUrl,
          linkedinUrl: student.linkedinUrl,
          score: student.score,
          user: {
            id: student.userId,
            username: student.username,
            email: student.userEmail,
            role: student.userRole,
          },
          class: student.classId ? {
            id: student.classId,
            name: student.className!,
          } : null,
          skills: studentSkillsData,
          projectCount: student.projectCount,
          avgAssessmentScore: student.avgAssessmentScore,
          totalLikes: student.totalLikes,
          followingCount: student.followingCount,
          followerCount: student.followerCount,
        };
      })
    );

    return detailedStudents;
  } catch (error) {
    console.error('Error fetching top students:', error);
    return [];
  }
}