import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studentFollows, students } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

// POST /api/students/[id]/follow - Follow a student
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params;
    
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Extract the user ID from the Bearer token
    const userId = authHeader.replace('Bearer ', '');

    // Get the current student by user ID
    const currentStudentResult = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.userId, userId))
      .limit(1);

    if (currentStudentResult.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const currentStudentId = currentStudentResult[0].id;

    // Check if trying to follow themselves
    if (currentStudentId === studentId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // Check if target student exists
    const targetStudent = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
    if (targetStudent.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check if already following
    const existingFollow = await db
      .select()
      .from(studentFollows)
      .where(
        and(
          eq(studentFollows.followerId, currentStudentId),
          eq(studentFollows.followingId, studentId)
        )
      )
      .limit(1);

    if (existingFollow.length > 0) {
      return NextResponse.json({ error: 'Already following this student' }, { status: 400 });
    }

    // Create follow relationship
    await db.insert(studentFollows).values({
      followerId: currentStudentId,
      followingId: studentId,
    });

    return NextResponse.json({ message: 'Successfully followed student' }, { status: 201 });
  } catch (error) {
    console.error('Error following student:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/students/[id]/follow - Unfollow a student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params;
    
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Extract the user ID from the Bearer token
    const userId = authHeader.replace('Bearer ', '');

    // Get the current student by user ID
    const currentStudentResult = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.userId, userId))
      .limit(1);

    if (currentStudentResult.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const currentStudentId = currentStudentResult[0].id;

    // Find and delete the follow relationship
    const result = await db
      .delete(studentFollows)
      .where(
        and(
          eq(studentFollows.followerId, currentStudentId),
          eq(studentFollows.followingId, studentId)
        )
      );

    return NextResponse.json({ message: 'Successfully unfollowed student' }, { status: 200 });
  } catch (error) {
    console.error('Error unfollowing student:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/students/[id]/follow - Check if current user follows this student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params;
    
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ isFollowing: false });
    }

    // Extract the user ID from the Bearer token
    const userId = authHeader.replace('Bearer ', '');

    // Get the current student by user ID
    const currentStudentResult = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.userId, userId))
      .limit(1);

    if (currentStudentResult.length === 0) {
      return NextResponse.json({ isFollowing: false });
    }

    const currentStudentId = currentStudentResult[0].id;

    // Check if following
    const existingFollow = await db
      .select()
      .from(studentFollows)
      .where(
        and(
          eq(studentFollows.followerId, currentStudentId),
          eq(studentFollows.followingId, studentId)
        )
      )
      .limit(1);

    return NextResponse.json({ isFollowing: existingFollow.length > 0 });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}