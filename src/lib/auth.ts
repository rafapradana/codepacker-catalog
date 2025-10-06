import bcrypt from 'bcryptjs';
import { db } from './db';
import { users, admins, students } from './schema';
import { eq, and } from 'drizzle-orm';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

export interface StudentUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePhotoUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  classId?: string;
}

export async function authenticateAdmin(credentials: LoginCredentials): Promise<AdminUser | null> {
  try {
    // Find user by username and role
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
      })
      .from(users)
      .where(and(
        eq(users.username, credentials.username),
        eq(users.role, 'admin')
      ))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    const foundUser = user[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, foundUser.passwordHash);
    
    if (!isPasswordValid) {
      return null;
    }

    // Get admin details
    const adminDetails = await db
      .select({
        fullName: admins.fullName,
      })
      .from(admins)
      .where(eq(admins.userId, foundUser.id))
      .limit(1);

    if (adminDetails.length === 0) {
      return null;
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, foundUser.id));

    return {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      fullName: adminDetails[0].fullName,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function authenticateStudent(credentials: LoginCredentials): Promise<StudentUser | null> {
  try {
    // Find user by username and role
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
      })
      .from(users)
      .where(and(
        eq(users.username, credentials.username),
        eq(users.role, 'student')
      ))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    const foundUser = user[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, foundUser.passwordHash);
    
    if (!isPasswordValid) {
      return null;
    }

    // Get student details
    const studentDetails = await db
      .select({
        fullName: students.fullName,
        bio: students.bio,
        profilePhotoUrl: students.profilePhotoUrl,
        githubUrl: students.githubUrl,
        linkedinUrl: students.linkedinUrl,
        classId: students.classId,
      })
      .from(students)
      .where(eq(students.userId, foundUser.id))
      .limit(1);

    if (studentDetails.length === 0) {
      return null;
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, foundUser.id));

    return {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      fullName: studentDetails[0].fullName,
      bio: studentDetails[0].bio || undefined,
      profilePhotoUrl: studentDetails[0].profilePhotoUrl || undefined,
      githubUrl: studentDetails[0].githubUrl || undefined,
      linkedinUrl: studentDetails[0].linkedinUrl || undefined,
      classId: studentDetails[0].classId || undefined,
    };
  } catch (error) {
    console.error('Student authentication error:', error);
    return null;
  }
}