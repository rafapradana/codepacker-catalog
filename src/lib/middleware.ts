import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, students } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthenticatedStudent {
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
  user: AuthenticatedUser;
}

export type AuthenticatedHandler = (
  request: NextRequest,
  context: { user: AuthenticatedUser; student: AuthenticatedStudent }
) => Promise<NextResponse>;

export async function withStudentAuth(
  request: NextRequest,
  handler: AuthenticatedHandler
): Promise<NextResponse> {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Extract the user ID from the Bearer token
    const userId = authHeader.replace('Bearer ', '');

    // Fetch user and student data
    const result = await db
      .select({
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
        },
        student: {
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
        },
      })
      .from(users)
      .leftJoin(students, eq(users.id, students.userId))
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0 || !result[0].user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!result[0].student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    const user = result[0].user;
    const student = {
      ...result[0].student,
      user,
    } as AuthenticatedStudent;

    // Call the handler with authenticated context
    return await handler(request, { user, student });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}