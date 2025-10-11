import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { feedback, students, users, classes } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Schema for feedback submission
const feedbackSchema = z.object({
  feedbackText: z.string().min(1, 'Feedback text is required').max(1000, 'Feedback text must be less than 1000 characters'),
  studentId: z.string().uuid('Invalid student ID format'),
});

// POST /api/feedback - Submit student feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = feedbackSchema.parse(body);

    // Verify student exists
    const student = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.id, validatedData.studentId))
      .limit(1);

    if (student.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create feedback entry
    const [newFeedback] = await db
      .insert(feedback)
      .values({
        studentId: validatedData.studentId,
        feedbackText: validatedData.feedbackText,
        status: 'belum ditanggapi',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      { 
        message: 'Feedback berhasil dikirim',
        feedback: newFeedback 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal mengirim feedback' },
      { status: 500 }
    );
  }
}

// GET /api/feedback - Get all feedback for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    
    const offset = (page - 1) * limit;

    // Build base query
    const baseQuery = db
      .select({
        id: feedback.id,
        feedbackText: feedback.feedbackText,
        status: feedback.status,
        createdAt: feedback.createdAt,
        studentId: students.id,
        studentFullName: students.fullName,
        studentUsername: users.username,
        studentProfilePhotoUrl: students.profilePhotoUrl,
        classId: classes.id,
        className: classes.name,
      })
      .from(feedback)
      .leftJoin(students, eq(feedback.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id));

    // Apply conditional where clause and get results
    const rawResults = status 
      ? await baseQuery
          .where(eq(feedback.status, status))
          .orderBy(feedback.createdAt)
          .limit(limit)
          .offset(offset)
      : await baseQuery
          .orderBy(feedback.createdAt)
          .limit(limit)
          .offset(offset);

    // Transform the results to match the expected structure
    const feedbackList = rawResults.map(row => ({
      id: row.id,
      feedbackText: row.feedbackText,
      status: row.status,
      createdAt: row.createdAt,
      student: {
        id: row.studentId,
        fullName: row.studentFullName,
        username: row.studentUsername,
        profilePhotoUrl: row.studentProfilePhotoUrl,
        class: row.classId ? {
          id: row.classId,
          name: row.className,
        } : null,
      },
    }));

    return NextResponse.json({
      feedback: feedbackList,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data feedback' },
      { status: 500 }
    );
  }
}