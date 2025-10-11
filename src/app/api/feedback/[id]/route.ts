import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { feedback } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Schema for updating feedback status
const updateFeedbackSchema = z.object({
  status: z.enum(['belum ditanggapi', 'sudah ditanggapi', 'ditolak'], {
    message: 'Status must be one of: belum ditanggapi, sudah ditanggapi, ditolak'
  }),
});

// PUT /api/feedback/[id] - Update feedback status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: feedbackId } = await params;

    // Validate UUID
    if (!z.string().uuid().safeParse(feedbackId).success) {
      return NextResponse.json(
        { error: 'Invalid feedback ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateFeedbackSchema.parse(body);

    // Check if feedback exists
    const existingFeedback = await db
      .select({ id: feedback.id })
      .from(feedback)
      .where(eq(feedback.id, feedbackId))
      .limit(1);

    if (existingFeedback.length === 0) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Update feedback status
    const [updatedFeedback] = await db
      .update(feedback)
      .set({
        status: validatedData.status,
        updatedAt: new Date(),
      })
      .where(eq(feedback.id, feedbackId))
      .returning();

    return NextResponse.json({
      message: 'Status feedback berhasil diperbarui',
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal memperbarui status feedback' },
      { status: 500 }
    );
  }
}