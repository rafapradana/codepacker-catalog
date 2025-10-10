import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { gradingMetrics } from '@/lib/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Zod schema for updating grading metrics
const updateGradingMetricSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  maxScore: z.number().min(1).max(10).optional(),
  weight: z.number().min(0.1).max(5).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/grading/metrics/[id] - Get a specific grading metric
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Metric ID is required' },
        { status: 400 }
      );
    }

    const [metric] = await db
      .select()
      .from(gradingMetrics)
      .where(eq(gradingMetrics.id, id));
    
    if (!metric) {
      return NextResponse.json(
        { success: false, error: 'Grading metric not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: metric 
    });

  } catch (error) {
    console.error(`Error in GET /api/grading/metrics/${(await params).id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/grading/metrics/[id] - Update a specific grading metric
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Metric ID is required' },
        { status: 400 }
      );
    }

    // Validate request body
    const validationResult = updateGradingMetricSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const updateData: any = { ...validationResult.data };
    if (updateData.weight !== undefined) {
      updateData.weight = updateData.weight.toString();
    }
    
    // Update the metric
    const [updatedMetric] = await db
      .update(gradingMetrics)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(gradingMetrics.id, id))
      .returning();
    
    if (!updatedMetric) {
      return NextResponse.json(
        { success: false, error: 'Grading metric not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedMetric,
      message: 'Grading metric updated successfully' 
    });

  } catch (error) {
    console.error(`Error in PUT /api/grading/metrics/${(await params).id}:`, error);
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { success: false, error: 'A metric with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/grading/metrics/[id] - Delete a specific grading metric
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Metric ID is required' },
        { status: 400 }
      );
    }

    // Check if the metric is being used in any grades
    // Note: This would require a more complex query to check projectGradeDetails
    // For now, we'll just delete the metric and let the database handle constraints
    
    const [deletedMetric] = await db
      .delete(gradingMetrics)
      .where(eq(gradingMetrics.id, id))
      .returning();
    
    if (!deletedMetric) {
      return NextResponse.json(
        { success: false, error: 'Grading metric not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Grading metric deleted successfully' 
    });

  } catch (error) {
    console.error(`Error in DELETE /api/grading/metrics/${(await params).id}:`, error);
    
    // Handle foreign key constraint violations
    if (error instanceof Error && error.message.includes('foreign key')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete metric that is being used in project grades' 
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}