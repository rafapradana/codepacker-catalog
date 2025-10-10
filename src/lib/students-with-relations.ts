import { db } from '@/lib/db';
import { 
  students, 
  classes, 
  skills, 
  projects, 
  categories, 
  techstacks, 
  studentSkills, 
  projectTechstacks,
  users 
} from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface StudentWithRelations {
  id: string;
  userId: string;
  fullName: string;
  bio: string | null;
  profilePhotoUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  classId: string | null;
  createdAt: Date;
  updatedAt: Date;
  className: string | null;
  user: {
    id: string;
    username: string | null;
    email: string | null;
    role: string | null;
  } | null;
  class: {
    id: string;
    name: string | null;
  } | null;
  skills: Array<{
    id: string;
    name: string;
    iconUrl: string | null;
    bgHex: string;
    borderHex: string;
    textHex: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    githubUrl: string;
    liveDemoUrl: string | null;
    categoryName: string | null;
    techstacks: Array<{
      id: string;
      name: string;
      iconUrl: string | null;
    }>;
  }>;
}

export async function getStudentsWithRelations(): Promise<StudentWithRelations[]> {
  try {
    // Get all students with their class and user information
    const studentsData = await db
      .select({
        id: students.id,
        userId: students.userId,
        fullName: students.fullName,
        bio: students.bio,
        profilePhotoUrl: students.profilePhotoUrl,
        githubUrl: students.githubUrl,
        linkedinUrl: students.linkedinUrl,
        classId: students.classId,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        className: classes.name,
        classIdFromClass: classes.id,
        userIdFromUser: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
      })
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(users, eq(students.userId, users.id));

    // Get skills for each student
    const studentsWithSkills = await Promise.all(
      studentsData.map(async (student) => {
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
          userId: student.userId,
          fullName: student.fullName,
          bio: student.bio,
          profilePhotoUrl: student.profilePhotoUrl,
          githubUrl: student.githubUrl,
          linkedinUrl: student.linkedinUrl,
          classId: student.classId,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
          className: student.className,
          user: student.userIdFromUser ? {
            id: student.userIdFromUser,
            username: student.username,
            email: student.email,
            role: student.role,
          } : null,
          class: student.classIdFromClass ? {
            id: student.classIdFromClass,
            name: student.className,
          } : null,
          skills: studentSkillsData,
        };
      })
    );

    // Get projects for each student
    const studentsWithProjects = await Promise.all(
      studentsWithSkills.map(async (student) => {
        const studentProjects = await db
          .select({
            id: projects.id,
            title: projects.title,
            description: projects.description,
            thumbnailUrl: projects.thumbnailUrl,
            githubUrl: projects.githubUrl,
            liveDemoUrl: projects.liveDemoUrl,
            categoryName: categories.name,
          })
          .from(projects)
          .leftJoin(categories, eq(projects.categoryId, categories.id))
          .where(eq(projects.studentId, student.id));

        // Get techstacks for each project
        const projectsWithTechstacks = await Promise.all(
          studentProjects.map(async (project) => {
            const projectTechstacksData = await db
              .select({
                id: techstacks.id,
                name: techstacks.name,
                iconUrl: techstacks.iconUrl,
              })
              .from(projectTechstacks)
              .innerJoin(techstacks, eq(projectTechstacks.techstackId, techstacks.id))
              .where(eq(projectTechstacks.projectId, project.id));

            return {
              ...project,
              techstacks: projectTechstacksData,
            };
          })
        );

        return {
          ...student,
          projects: projectsWithTechstacks,
        };
      })
    );

    return studentsWithProjects;
  } catch (error) {
    console.error('Error fetching students with relations:', error);
    return [];
  }
}

export async function getStudentWithRelationsById(studentId: string): Promise<StudentWithRelations | null> {
  try {
    // Get student with class and user information
    const studentData = await db
      .select({
        id: students.id,
        userId: students.userId,
        fullName: students.fullName,
        bio: students.bio,
        profilePhotoUrl: students.profilePhotoUrl,
        githubUrl: students.githubUrl,
        linkedinUrl: students.linkedinUrl,
        classId: students.classId,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        className: classes.name,
        classIdFromClass: classes.id,
        userIdFromUser: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
      })
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(users, eq(students.userId, users.id))
      .where(eq(students.id, studentId));

    if (!studentData[0]) {
      return null;
    }

    const student = studentData[0];

    // Get skills for the student
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

    // Get projects for the student
    const studentProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        thumbnailUrl: projects.thumbnailUrl,
        githubUrl: projects.githubUrl,
        liveDemoUrl: projects.liveDemoUrl,
        categoryName: categories.name,
      })
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(eq(projects.studentId, student.id));

    // Get techstacks for each project
    const projectsWithTechstacks = await Promise.all(
      studentProjects.map(async (project) => {
        const projectTechstacksData = await db
          .select({
            id: techstacks.id,
            name: techstacks.name,
            iconUrl: techstacks.iconUrl,
          })
          .from(projectTechstacks)
          .innerJoin(techstacks, eq(projectTechstacks.techstackId, techstacks.id))
          .where(eq(projectTechstacks.projectId, project.id));

        return {
          ...project,
          techstacks: projectTechstacksData,
        };
      })
    );

    return {
      id: student.id,
      userId: student.userId,
      fullName: student.fullName,
      bio: student.bio,
      profilePhotoUrl: student.profilePhotoUrl,
      githubUrl: student.githubUrl,
      linkedinUrl: student.linkedinUrl,
      classId: student.classId,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      className: student.className,
      user: student.userIdFromUser ? {
        id: student.userIdFromUser,
        username: student.username,
        email: student.email,
        role: student.role,
      } : null,
      class: student.classIdFromClass ? {
        id: student.classIdFromClass,
        name: student.className,
      } : null,
      skills: studentSkillsData,
      projects: projectsWithTechstacks,
    };
  } catch (error) {
    console.error('Error fetching student with relations by id:', error);
    return null;
  }
}