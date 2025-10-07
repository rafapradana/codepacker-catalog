import { db } from '@/lib/db';
import { students, studentSkills, skills, classes, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { createUser, updateUser } from '@/lib/users';

export interface Student {
  id: string;
  userId: string;
  fullName: string;
  bio?: string | null;
  profilePhotoUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  classId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  } | null;
  class?: {
    id: string;
    name: string;
  } | null;
}

export interface StudentWithSkills extends Student {
  skills: {
    id: string;
    name: string;
    iconUrl: string | null;
    bgHex: string;
    borderHex: string;
    textHex: string;
  }[];
}

export interface CreateStudentData {
  userId: string;
  fullName: string;
  bio?: string | null;
  profilePhotoUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  classId?: string | null;
}

export interface CreateStudentWithUserData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio?: string;
  profilePhotoUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  classId?: string | null;
}

export interface UpdateStudentData {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  bio?: string | null;
  profilePhotoUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  classId?: string | null;
}

export async function getStudents(): Promise<Student[]> {
  try {
    const result = await db
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
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
        },
        class: {
          id: classes.id,
          name: classes.name,
        },
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id));
    
    return result;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const result = await db
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
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
        },
        class: {
          id: classes.id,
          name: classes.name,
        },
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .where(eq(students.id, id));
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching student by id:', error);
    return null;
  }
}

export async function getStudentByUserId(userId: string): Promise<Student | null> {
  try {
    const result = await db
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
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
        },
        class: {
          id: classes.id,
          name: classes.name,
        },
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .where(eq(students.userId, userId));
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching student by user id:', error);
    return null;
  }
}

export async function createStudent(data: CreateStudentData): Promise<Student | null> {
  try {
    const result = await db.insert(students).values({
      userId: data.userId,
      fullName: data.fullName,
      bio: data.bio || null,
      profilePhotoUrl: data.profilePhotoUrl || null,
      githubUrl: data.githubUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      classId: data.classId || null,
    }).returning();
    
    if (result[0]) {
      return await getStudentById(result[0].id);
    }
    return null;
  } catch (error) {
    console.error('Error creating student:', error);
    return null;
  }
}

export async function createStudentWithUser(data: CreateStudentWithUserData): Promise<Student | null> {
  try {
    // First create the user
    const newUser = await createUser({
      username: data.username,
      email: data.email,
      password: data.password,
      role: 'student'
    });

    // Then create the student with the user ID
    const studentData: CreateStudentData = {
      userId: newUser.id,
      fullName: data.fullName,
      bio: data.bio,
      profilePhotoUrl: data.profilePhotoUrl,
      githubUrl: data.githubUrl,
      linkedinUrl: data.linkedinUrl,
      classId: data.classId,
    };

    return await createStudent(studentData);
  } catch (error) {
    console.error('Error creating student with user:', error);
    return null;
  }
}

export async function updateStudent(id: string, data: UpdateStudentData): Promise<Student | null> {
  try {
    // First get the student to get the userId
    const student = await getStudentById(id);
    if (!student) {
      return null;
    }

    // Update user data if provided
    if (data.username !== undefined || data.email !== undefined || data.password !== undefined) {
      const userUpdateData: any = {};
      if (data.username !== undefined) userUpdateData.username = data.username;
      if (data.email !== undefined) userUpdateData.email = data.email;
      if (data.password !== undefined) userUpdateData.password = data.password;
      
      await updateUser(student.userId, userUpdateData);
    }

    // Update student data
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.profilePhotoUrl !== undefined) updateData.profilePhotoUrl = data.profilePhotoUrl;
    if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl;
    if (data.linkedinUrl !== undefined) updateData.linkedinUrl = data.linkedinUrl;
    if (data.classId !== undefined) updateData.classId = data.classId;

    const result = await db.update(students)
      .set(updateData)
      .where(eq(students.id, id))
      .returning();
    
    if (result[0]) {
      return await getStudentById(result[0].id);
    }
    return null;
  } catch (error) {
    console.error('Error updating student:', error);
    return null;
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  try {
    // First delete all student skills
    await db.delete(studentSkills).where(eq(studentSkills.studentId, id));
    
    // Then delete the student
    await db.delete(students).where(eq(students.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting student:', error);
    return false;
  }
}

// Student Skills Management
export async function getStudentSkills(studentId: string) {
  try {
    const result = await db
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
      .where(eq(studentSkills.studentId, studentId));
    
    return result;
  } catch (error) {
    console.error('Error fetching student skills:', error);
    return [];
  }
}

export async function addStudentSkill(studentId: string, skillId: string) {
  try {
    // Check if student exists
    const student = await getStudentById(studentId);
    if (!student) {
      return { success: false, error: "Student not found" };
    }
    
    // Check if skill exists
    const skill = await db.select().from(skills).where(eq(skills.id, skillId));
    if (!skill[0]) {
      return { success: false, error: "Skill not found" };
    }
    
    // Check if relationship already exists
    const existing = await db
      .select()
      .from(studentSkills)
      .where(and(
        eq(studentSkills.studentId, studentId),
        eq(studentSkills.skillId, skillId)
      ));
    
    if (existing.length > 0) {
      return { success: false, error: "Student already has this skill" };
    }
    
    // Add the skill to student
    const result = await db.insert(studentSkills).values({
      studentId,
      skillId,
    }).returning();
    
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error adding student skill:', error);
    return { success: false, error: "Failed to add student skill" };
  }
}

export async function removeStudentSkill(studentId: string, skillId: string) {
  try {
    const result = await db
      .delete(studentSkills)
      .where(and(
        eq(studentSkills.studentId, studentId),
        eq(studentSkills.skillId, skillId)
      ))
      .returning();
    
    if (result.length === 0) {
      return { success: false, error: "Student skill not found" };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error removing student skill:', error);
    return { success: false, error: "Failed to remove student skill" };
  }
}