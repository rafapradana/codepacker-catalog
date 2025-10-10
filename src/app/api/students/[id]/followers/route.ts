import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studentFollows, students, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET /api/students/[id]/followers - Get list of followers for a student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Check if student exists
    const targetStudent = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
    if (targetStudent.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get followers with their profile information
    const followers = await db
      .select({
        id: students.id,
        fullName: students.fullName,
        profilePhotoUrl: students.profilePhotoUrl,
        githubUrl: students.githubUrl,
        linkedinUrl: students.linkedinUrl,
        username: users.username,
        followedAt: studentFollows.createdAt,
      })
      .from(studentFollows)
      .innerJoin(students, eq(studentFollows.followerId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .where(eq(studentFollows.followingId, studentId))
      .orderBy(studentFollows.createdAt)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalFollowers = await db
      .select({ count: studentFollows.id })
      .from(studentFollows)
      .where(eq(studentFollows.followingId, studentId));

    const totalCount = totalFollowers.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      followers,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}