import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { students, studentFollows } from '@/lib/schema';
import { eq, count } from 'drizzle-orm';

// GET /api/students/[id]/stats - Get follower and following counts for a student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params;

    // Check if student exists
    const targetStudent = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
    if (targetStudent.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get followers count
    const followersCount = await db
      .select({ count: count() })
      .from(studentFollows)
      .where(eq(studentFollows.followingId, studentId));

    // Get following count
    const followingCount = await db
      .select({ count: count() })
      .from(studentFollows)
      .where(eq(studentFollows.followerId, studentId));

    return NextResponse.json({
      followersCount: followersCount[0]?.count || 0,
      followingCount: followingCount[0]?.count || 0,
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}