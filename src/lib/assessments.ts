import { db } from './db';
import { projectAssessments, projects, students, classes, categories, admins, users } from './schema';
import { eq, isNull, desc, asc } from 'drizzle-orm';

export interface AssessmentCriteria {
  codeQuality: number;
  functionality: number;
  uiDesign: number;
  userExperience: number;
  responsiveness: number;
  documentation: number;
  creativity: number;
  technologyImplementation: number;
  performance: number;
  deployment: number;
}

export interface ProjectForAssessment {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  githubUrl: string;
  liveDemoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  student: {
    id: string;
    fullName: string;
    profilePhotoUrl: string | null;
    user: {
      id: string;
      username: string;
      email: string;
    };
    class: {
      id: string;
      name: string;
    } | null;
  };
  category: {
    id: string;
    name: string;
  } | null;
  assessment: {
    id: string;
    codeQuality: number;
    functionality: number;
    uiDesign: number;
    userExperience: number;
    responsiveness: number;
    documentation: number;
    creativity: number;
    technologyImplementation: number;
    performance: number;
    deployment: number;
    totalScore: number;
    finalGrade: string;
    notes: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

// Get all projects for assessment with their current assessment status
export async function getProjectsForAssessment(): Promise<ProjectForAssessment[]> {
  try {
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
        updatedAt: projects.updatedAt,
        // Student fields
        studentId: students.id,
        studentFullName: students.fullName,
        studentProfilePhotoUrl: students.profilePhotoUrl,
        // User fields
        userId: users.id,
        username: users.username,
        userEmail: users.email,
        // Class fields
        classId: classes.id,
        className: classes.name,
        // Category fields
        categoryId: categories.id,
        categoryName: categories.name,
        // Assessment fields
        assessmentId: projectAssessments.id,
        codeQuality: projectAssessments.codeQuality,
        functionality: projectAssessments.functionality,
        uiDesign: projectAssessments.uiDesign,
        userExperience: projectAssessments.userExperience,
        responsiveness: projectAssessments.responsiveness,
        documentation: projectAssessments.documentation,
        creativity: projectAssessments.creativity,
        technologyImplementation: projectAssessments.technologyImplementation,
        performance: projectAssessments.performance,
        deployment: projectAssessments.deployment,
        totalScore: projectAssessments.totalScore,
        finalGrade: projectAssessments.finalGrade,
        notes: projectAssessments.notes,
        assessmentStatus: projectAssessments.status,
        assessmentCreatedAt: projectAssessments.createdAt,
        assessmentUpdatedAt: projectAssessments.updatedAt,
      })
      .from(projects)
      .innerJoin(students, eq(projects.studentId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .leftJoin(projectAssessments, eq(projects.id, projectAssessments.projectId))
      .orderBy(projects.createdAt);

    // Transform the flat result into the nested structure
    return result.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      thumbnailUrl: row.thumbnailUrl,
      githubUrl: row.githubUrl,
      liveDemoUrl: row.liveDemoUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      student: {
        id: row.studentId,
        fullName: row.studentFullName,
        profilePhotoUrl: row.studentProfilePhotoUrl,
        user: {
          id: row.userId,
          username: row.username,
          email: row.userEmail,
        },
        class: row.classId ? {
          id: row.classId,
          name: row.className!,
        } : null,
      },
      category: row.categoryId ? {
        id: row.categoryId,
        name: row.categoryName!,
      } : null,
      assessment: row.assessmentId ? {
        id: row.assessmentId,
        codeQuality: row.codeQuality!,
        functionality: row.functionality!,
        uiDesign: row.uiDesign!,
        userExperience: row.userExperience!,
        responsiveness: row.responsiveness!,
        documentation: row.documentation!,
        creativity: row.creativity!,
        technologyImplementation: row.technologyImplementation!,
        performance: row.performance!,
        deployment: row.deployment!,
        totalScore: row.totalScore!,
        finalGrade: row.finalGrade!,
        notes: row.notes,
        status: row.assessmentStatus!,
        createdAt: row.assessmentCreatedAt!,
        updatedAt: row.assessmentUpdatedAt!,
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching projects for assessment:', error);
    throw new Error('Failed to fetch projects for assessment');
  }
}

// Get projects that haven't been assessed yet
export async function getUnassessedProjects(): Promise<ProjectForAssessment[]> {
  try {
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
        updatedAt: projects.updatedAt,
        // Student fields
        studentId: students.id,
        studentFullName: students.fullName,
        studentProfilePhotoUrl: students.profilePhotoUrl,
        // User fields
        userId: users.id,
        username: users.username,
        userEmail: users.email,
        // Class fields
        classId: classes.id,
        className: classes.name,
        // Category fields
        categoryId: categories.id,
        categoryName: categories.name,
      })
      .from(projects)
      .innerJoin(students, eq(projects.studentId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .leftJoin(projectAssessments, eq(projects.id, projectAssessments.projectId))
      .where(isNull(projectAssessments.id))
      .orderBy(desc(projects.createdAt));

    // Transform the flat result into the nested structure
    return result.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      thumbnailUrl: row.thumbnailUrl,
      githubUrl: row.githubUrl,
      liveDemoUrl: row.liveDemoUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      student: {
        id: row.studentId,
        fullName: row.studentFullName,
        profilePhotoUrl: row.studentProfilePhotoUrl,
        user: {
          id: row.userId,
          username: row.username,
          email: row.userEmail,
        },
        class: row.classId ? {
          id: row.classId,
          name: row.className!,
        } : null,
      },
      category: row.categoryId ? {
        id: row.categoryId,
        name: row.categoryName!,
      } : null,
      assessment: null,
    }));
  } catch (error) {
    console.error('Error fetching unassessed projects:', error);
    throw new Error('Failed to fetch unassessed projects');
  }
}

// Calculate final grade based on total score
export function calculateFinalGrade(totalScore: number): string {
  if (totalScore >= 90) return 'A';
  if (totalScore >= 80) return 'B';
  if (totalScore >= 70) return 'C';
  if (totalScore >= 60) return 'D';
  return 'E';
}

// Create a new project assessment
export async function createProjectAssessment(data: {
  projectId: string;
  codeQuality: number;
  functionality: number;
  uiDesign: number;
  userExperience: number;
  responsiveness: number;
  documentation: number;
  creativity: number;
  technologyImplementation: number;
  performance: number;
  deployment: number;
  totalScore: number;
  finalGrade: string;
  notes: string;
  status: string;
}) {
  try {
    // Get the current admin user (you might need to pass this as a parameter)
    const adminResult = await db.select().from(admins).limit(1);
    if (adminResult.length === 0) {
      throw new Error('No admin found to create assessment');
    }
    
    const result = await db.insert(projectAssessments).values({
      projectId: data.projectId,
      assessorId: adminResult[0].id,
      codeQuality: data.codeQuality,
      functionality: data.functionality,
      uiDesign: data.uiDesign,
      userExperience: data.userExperience,
      responsiveness: data.responsiveness,
      documentation: data.documentation,
      creativity: data.creativity,
      technologyImplementation: data.technologyImplementation,
      performance: data.performance,
      deployment: data.deployment,
      totalScore: data.totalScore,
      finalGrade: data.finalGrade,
      notes: data.notes,
      status: data.status,
    }).returning();
    
    return {
      success: true,
      message: 'Assessment created successfully',
      data: result[0]
    };
  } catch (error) {
    console.error('Error creating project assessment:', error);
    throw new Error('Failed to create project assessment');
  }
}

// Update an existing project assessment
export async function updateProjectAssessment(
  assessmentId: string,
  data: {
    codeQuality: number;
    functionality: number;
    uiDesign: number;
    userExperience: number;
    responsiveness: number;
    documentation: number;
    creativity: number;
    technologyImplementation: number;
    performance: number;
    deployment: number;
    totalScore: number;
    finalGrade: string;
    notes: string;
    status: string;
  }
): Promise<void> {
  try {
    await db
      .update(projectAssessments)
      .set({
        codeQuality: data.codeQuality,
        functionality: data.functionality,
        uiDesign: data.uiDesign,
        userExperience: data.userExperience,
        responsiveness: data.responsiveness,
        documentation: data.documentation,
        creativity: data.creativity,
        technologyImplementation: data.technologyImplementation,
        performance: data.performance,
        deployment: data.deployment,
        totalScore: data.totalScore,
        finalGrade: data.finalGrade,
        notes: data.notes,
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(projectAssessments.id, assessmentId));
  } catch (error) {
    console.error('Error updating project assessment:', error);
    throw new Error('Failed to update project assessment');
  }
}

// Get assessment by project ID
export async function getAssessmentByProjectId(projectId: string) {
  const [assessment] = await db
    .select()
    .from(projectAssessments)
    .where(eq(projectAssessments.projectId, projectId));

  return assessment;
}

// Get assessment statistics
export async function getAssessmentStatistics() {
  const totalProjects = await db
    .select({ count: projects.id })
    .from(projects);

  const assessedProjects = await db
    .select({ count: projectAssessments.id })
    .from(projectAssessments);

  const unassessedCount = totalProjects.length - assessedProjects.length;

  // Grade distribution
  const gradeDistribution = await db
    .select({
      grade: projectAssessments.finalGrade,
      count: projectAssessments.id,
    })
    .from(projectAssessments);

  return {
    totalProjects: totalProjects.length,
    assessedProjects: assessedProjects.length,
    unassessedProjects: unassessedCount,
    gradeDistribution,
  };
}

export interface AssessmentScores {
  codeQuality: number
  functionality: number
  uiDesign: number
  userExperience: number
  responsiveness: number
  documentation: number
  creativity: number
  technologyImplementation: number
  performance: number
  deployment: number
}
export const ASSESSMENT_CRITERIA = {
  codeQuality: {
    name: 'Kualitas Kode',
    description: 'Struktur kode, clean code, best practices, dan maintainability',
  },
  functionality: {
    name: 'Fungsionalitas',
    description: 'Kelengkapan fitur, bug-free, dan sesuai requirements',
  },
  uiDesign: {
    name: 'Desain UI',
    description: 'Estetika, konsistensi visual, dan penggunaan warna/typography',
  },
  userExperience: {
    name: 'User Experience',
    description: 'Kemudahan penggunaan, navigasi intuitif, dan user flow',
  },
  responsiveness: {
    name: 'Responsivitas',
    description: 'Adaptasi tampilan di berbagai ukuran layar dan device',
  },
  documentation: {
    name: 'Dokumentasi',
    description: 'README, komentar kode, dan dokumentasi penggunaan',
  },
  creativity: {
    name: 'Kreativitas & Inovasi',
    description: 'Originalitas ide, solusi kreatif, dan inovasi dalam implementasi',
  },
  technologyImplementation: {
    name: 'Implementasi Teknologi',
    description: 'Penggunaan teknologi yang tepat dan implementasi yang baik',
  },
  performance: {
    name: 'Performa & Optimisasi',
    description: 'Kecepatan loading, optimisasi aset, dan performa aplikasi',
  },
  deployment: {
    name: 'Deployment & Live Demo',
    description: 'Keberhasilan deployment dan kualitas live demo',
  },
} as const;