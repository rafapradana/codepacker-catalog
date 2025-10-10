import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { gradingMetrics } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { createDefaultGradingMetrics } from '@/lib/project-grading';

// Zod schema for creating/updating grading metrics
const gradingMetricSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  maxScore: z.number().min(1).max(10).default(10),
  weight: z.number().min(0.1).max(5).default(1),
  isActive: z.boolean().default(true),
});

// GET /api/grading/metrics - Get all grading metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const baseQuery = db.select().from(gradingMetrics);
    
    const metrics = activeOnly 
      ? await baseQuery.where(eq(gradingMetrics.isActive, true))
      : await baseQuery;

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Error in GET /api/grading/metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/grading/metrics - Create a new grading metric or initialize defaults
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a request to initialize default metrics
    if (body.action === 'initialize-defaults') {
      const defaultMetrics = await createDefaultGradingMetrics();
      return NextResponse.json({ 
        success: true, 
        data: defaultMetrics,
        message: 'Default grading metrics created successfully' 
      });
    }

    // Validate request body for creating a new metric
    const validationResult = gradingMetricSchema.safeParse(body);
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

    const metricData = { 
      ...validationResult.data,
      weight: validationResult.data.weight.toString()
    };
    
    // Create the new metric
    const [newMetric] = await db
      .insert(gradingMetrics)
      .values(metricData)
      .returning();
    
    return NextResponse.json({ 
      success: true, 
      data: newMetric,
      message: 'Grading metric created successfully' 
    });

  } catch (error) {
    console.error('Error in POST /api/grading/metrics:', error);
    
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

// PUT /api/grading/metrics - Update multiple metrics (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!Array.isArray(body.metrics)) {
      return NextResponse.json(
        { success: false, error: 'Expected an array of metrics' },
        { status: 400 }
      );
    }

    const updatedMetrics = [];
    
    for (const metric of body.metrics) {
      if (!metric.id) {
        continue;
      }

      const validationResult = gradingMetricSchema.partial().safeParse(metric);
      if (!validationResult.success) {
        continue;
      }

      const updateData: any = { ...validationResult.data };
      if (updateData.weight !== undefined) {
        updateData.weight = updateData.weight.toString();
      }

      const [updatedMetric] = await db
        .update(gradingMetrics)
        .set(updateData)
        .where(eq(gradingMetrics.id, metric.id))
        .returning();

      if (updatedMetric) {
        updatedMetrics.push(updatedMetric);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedMetrics,
      message: `${updatedMetrics.length} metrics updated successfully` 
    });

  } catch (error) {
    console.error('Error in PUT /api/grading/metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}