import { db } from './db';
import { 
  projects, 
  projectGrades, 
  projectGradeDetails, 
  gradingMetrics,
  students,
  categories,
  classes,
  admins
} from './schema';
import { eq, desc, sql, and, isNull } from 'drizzle-orm';

// Types for grading system
export interface GradingMetric {
  id: string;
  name: string;
  description?: string;
  maxScore: number;
  weight: number;
  isActive: boolean;
}

export interface ProjectGradeDetail {
  metricId: string;
  score: number;
  feedback?: string;
}

export interface ProjectGradeInput {
  projectId: string;
  gradedBy: string;
  gradeDetails: ProjectGradeDetail[];
  overallFeedback?: string;
}

export interface ProjectWithGradingInfo {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  githubUrl: string;
  liveDemoUrl?: string;
  createdAt: Date;
  student: {
    id: string;
    fullName: string;
    profilePhotoUrl?: string;
    user: {
      username: string;
    };
    class?: {
      name: string;
    };
  };
  category?: {
    name: string;
  };
  projectGrade?: {
    id: string;
    totalScore: number;
    maxPossibleScore: number;
    percentage: number;
    grade?: string;
    feedback?: string;
    gradedAt: Date;
    grader: {
      fullName: string;
    };
  };
}

// Get all grading metrics
export async function getGradingMetrics(): Promise<GradingMetric[]> {
  const metrics = await db
    .select()
    .from(gradingMetrics)
    .where(eq(gradingMetrics.isActive, true))
    .orderBy(gradingMetrics.name);
  
  return metrics.map(metric => ({
    id: metric.id,
    name: metric.name,
    description: metric.description || undefined,
    maxScore: metric.maxScore,
    weight: Number(metric.weight || '1.00'),
    isActive: metric.isActive,
  }));
}

// Get projects with grading information for admin grading page
export async function getProjectsForGrading(): Promise<ProjectWithGradingInfo[]> {
  const result = await db
    .select({
      // Project fields
      id: projects.id,
      title: projects.title,
      description: projects.description,
      thumbnailUrl: projects.thumbnailUrl,
      githubUrl: projects.githubUrl,
      liveDemoUrl: projects.liveDemoUrl,
      createdAt: projects.createdAt,
      // Student fields
      studentId: students.id,
      studentFullName: students.fullName,
      studentProfilePhotoUrl: students.profilePhotoUrl,
      studentUsername: sql<string>`${students.userId}`, // We'll need to join with users table
      // Class fields
      className: classes.name,
      // Category fields
      categoryName: categories.name,
      // Grade fields
      gradeId: projectGrades.id,
      totalScore: projectGrades.totalScore,
      maxPossibleScore: projectGrades.maxPossibleScore,
      percentage: projectGrades.percentage,
      grade: projectGrades.grade,
      gradeFeedback: projectGrades.feedback,
      gradedAt: projectGrades.gradedAt,
      graderFullName: admins.fullName,
    })
    .from(projects)
    .innerJoin(students, eq(projects.studentId, students.id))
    .leftJoin(classes, eq(students.classId, classes.id))
    .leftJoin(categories, eq(projects.categoryId, categories.id))
    .leftJoin(projectGrades, eq(projects.id, projectGrades.projectId))
    .leftJoin(admins, eq(projectGrades.gradedBy, admins.id))
    .orderBy(desc(projects.createdAt));

  // We need to get usernames separately due to the join complexity
  const projectsWithUsernames = await Promise.all(
    result.map(async (project) => {
      const studentUser = await db.query.students.findFirst({
        where: eq(students.id, project.studentId),
        with: {
          user: {
            columns: {
              username: true,
            },
          },
        },
      });

      return {
        id: project.id,
        title: project.title,
        description: project.description || undefined,
        thumbnailUrl: project.thumbnailUrl || undefined,
        githubUrl: project.githubUrl,
        liveDemoUrl: project.liveDemoUrl || undefined,
        createdAt: project.createdAt,
        student: {
          id: project.studentId,
          fullName: project.studentFullName,
          profilePhotoUrl: project.studentProfilePhotoUrl || undefined,
          user: {
            username: studentUser?.user.username || '',
          },
          class: project.className ? { name: project.className } : undefined,
        },
        category: project.categoryName ? { name: project.categoryName } : undefined,
        projectGrade: project.gradeId ? {
          id: project.gradeId,
          totalScore: parseFloat(project.totalScore || '0'),
          maxPossibleScore: parseFloat(project.maxPossibleScore || '0'),
          percentage: parseFloat(project.percentage || '0'),
          grade: project.grade || undefined,
          feedback: project.gradeFeedback || undefined,
          gradedAt: project.gradedAt!,
          grader: {
            fullName: project.graderFullName || '',
          },
        } : undefined,
      };
    })
  );

  return projectsWithUsernames;
}

// Get ungraded projects count
export async function getUngradedProjectsCount(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .leftJoin(projectGrades, eq(projects.id, projectGrades.projectId))
    .where(isNull(projectGrades.id));
  
  return result[0]?.count || 0;
}

// Get project grade details
export async function getProjectGradeDetails(projectGradeId: string) {
  return await db
    .select({
      id: projectGradeDetails.id,
      score: projectGradeDetails.score,
      feedback: projectGradeDetails.feedback,
      metric: {
        id: gradingMetrics.id,
        name: gradingMetrics.name,
        description: gradingMetrics.description,
        maxScore: gradingMetrics.maxScore,
        weight: gradingMetrics.weight,
      },
    })
    .from(projectGradeDetails)
    .innerJoin(gradingMetrics, eq(projectGradeDetails.metricId, gradingMetrics.id))
    .where(eq(projectGradeDetails.projectGradeId, projectGradeId));
}

// Calculate grade based on scores and metrics
function calculateGrade(totalScore: number, maxPossibleScore: number): string {
  const percentage = (totalScore / maxPossibleScore) * 100;
  
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

// Create or update project grade
export async function gradeProject(gradeInput: ProjectGradeInput): Promise<string> {
  return await db.transaction(async (tx) => {
    // Get all active metrics to calculate totals
    const metrics = await tx
      .select()
      .from(gradingMetrics)
      .where(eq(gradingMetrics.isActive, true));
    
    // Calculate total score and max possible score
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    for (const detail of gradeInput.gradeDetails) {
      const metric = metrics.find(m => m.id === detail.metricId);
      if (metric) {
        const weightedScore = detail.score * Number(metric.weight || '1.00');
        const weightedMaxScore = metric.maxScore * Number(metric.weight || '1.00');
        
        totalScore += weightedScore;
        maxPossibleScore += weightedMaxScore;
      }
    }
    
    const percentage = (totalScore / maxPossibleScore) * 100;
    const letterGrade = calculateGrade(totalScore, maxPossibleScore);
    
    // Check if grade already exists
    const existingGrade = await tx
      .select()
      .from(projectGrades)
      .where(eq(projectGrades.projectId, gradeInput.projectId))
      .limit(1);
    
    let gradeId: string;
    
    if (existingGrade.length > 0) {
      // Update existing grade
      gradeId = existingGrade[0].id;
      
      await tx
        .update(projectGrades)
        .set({
          gradedBy: gradeInput.gradedBy,
          totalScore: totalScore.toString(),
          maxPossibleScore: maxPossibleScore.toString(),
          percentage: percentage.toString(),
          grade: letterGrade,
          feedback: gradeInput.overallFeedback,
          updatedAt: new Date(),
        })
        .where(eq(projectGrades.id, gradeId));
      
      // Delete existing grade details
      await tx
        .delete(projectGradeDetails)
        .where(eq(projectGradeDetails.projectGradeId, gradeId));
    } else {
      // Create new grade
      const newGrade = await tx
        .insert(projectGrades)
        .values({
          projectId: gradeInput.projectId,
          gradedBy: gradeInput.gradedBy,
          totalScore: totalScore.toString(),
          maxPossibleScore: maxPossibleScore.toString(),
          percentage: percentage.toString(),
          grade: letterGrade,
          feedback: gradeInput.overallFeedback,
        })
        .returning({ id: projectGrades.id });
      
      gradeId = newGrade[0].id;
    }
    
    // Insert grade details
    for (const detail of gradeInput.gradeDetails) {
      await tx
        .insert(projectGradeDetails)
        .values({
          projectGradeId: gradeId,
          metricId: detail.metricId,
          score: detail.score.toString(),
          feedback: detail.feedback,
        });
    }
    
    return gradeId;
  });
}

// Delete project grade
export async function deleteProjectGrade(projectId: string): Promise<boolean> {
  let deleted = false;
  
  await db.transaction(async (tx) => {
    const grade = await tx
      .select()
      .from(projectGrades)
      .where(eq(projectGrades.projectId, projectId))
      .limit(1);
    
    if (grade.length > 0) {
      // Delete grade details first
      await tx
        .delete(projectGradeDetails)
        .where(eq(projectGradeDetails.projectGradeId, grade[0].id));
      
      // Delete grade
      await tx
        .delete(projectGrades)
        .where(eq(projectGrades.id, grade[0].id));
      
      deleted = true;
    }
  });
  
  return deleted;
}

// Create default grading metrics
export async function createDefaultGradingMetrics(): Promise<GradingMetric[]> {
  const defaultMetrics = [
    {
      name: 'Technical Implementation',
      description: 'Code quality, architecture, and technical execution',
      maxScore: 10,
      weight: 1.0,
    },
    {
      name: 'UI/UX Design',
      description: 'User interface design and user experience',
      maxScore: 10,
      weight: 1.0,
    },
    {
      name: 'Functionality',
      description: 'Feature completeness and working functionality',
      maxScore: 10,
      weight: 1.0,
    },
    {
      name: 'Code Quality',
      description: 'Code organization, readability, and best practices',
      maxScore: 10,
      weight: 1.0,
    },
    {
      name: 'Innovation & Creativity',
      description: 'Originality and creative problem solving',
      maxScore: 10,
      weight: 1.0,
    },
    {
      name: 'Performance',
      description: 'Application performance and optimization',
      maxScore: 10,
      weight: 0.8,
    },
    {
      name: 'Security',
      description: 'Security considerations and implementation',
      maxScore: 10,
      weight: 0.8,
    },
    {
      name: 'Documentation',
      description: 'Code documentation and README quality',
      maxScore: 10,
      weight: 0.6,
    },
    {
      name: 'Deployment & Accessibility',
      description: 'Deployment setup and accessibility features',
      maxScore: 10,
      weight: 0.6,
    },
    {
      name: 'Presentation & Communication',
      description: 'Project presentation and communication skills',
      maxScore: 10,
      weight: 0.4,
    },
  ];

  const createdMetrics: GradingMetric[] = [];

  for (const metric of defaultMetrics) {
    const [created] = await db
      .insert(gradingMetrics)
      .values({
        name: metric.name,
        description: metric.description,
        maxScore: metric.maxScore,
        weight: metric.weight.toString(),
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();
    
    if (created) {
      createdMetrics.push({
        id: created.id,
        name: created.name,
        description: created.description || undefined,
        maxScore: created.maxScore,
        weight: Number(created.weight || '1.00'),
        isActive: created.isActive,
      });
    }
  }
  
  return createdMetrics;
}