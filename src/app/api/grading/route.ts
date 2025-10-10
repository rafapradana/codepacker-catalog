import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  getProjectsForGrading, 
  getGradingMetrics, 
  gradeProject, 
  getUngradedProjectsCount,
  type ProjectGradeInput 
} from '@/lib/project-grading';

// Zod schema for grading a project
const gradeProjectSchema = z.object({
  projectId: z.string(),
  gradedBy: z.string(),
  gradeDetails: z.array(z.object({
    metricId: z.string(),
    score: z.number().min(1).max(10),
    feedback: z.string().optional(),
  })),
  overallFeedback: z.string().optional(),
});

// GET /api/grading - Get projects for grading
export async function GET(request: NextRequest) {
  try {
    // Default behavior: return projects for grading
    const projects = await getProjectsForGrading();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET /api/grading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/grading - Submit or update a project grade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = gradeProjectSchema.safeParse(body);
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

    const gradeInput: ProjectGradeInput = validationResult.data;
    
    // Submit the grade
    const result = await gradeProject(gradeInput);
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      message: 'Project graded successfully' 
    });

  } catch (error) {
    console.error('Error in POST /api/grading:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 404 }
        );
      }
      
      if (error.message.includes('already graded')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}