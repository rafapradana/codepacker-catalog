import { NextRequest, NextResponse } from 'next/server';
import { 
  getProjectGradeDetails, 
  deleteProjectGrade 
} from '@/lib/project-grading';

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

// GET /api/grading/[projectId] - Get detailed grading information for a specific project
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const gradeDetails = await getProjectGradeDetails(projectId);
    
    if (!gradeDetails) {
      return NextResponse.json(
        { success: false, error: 'Project grade not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: gradeDetails 
    });

  } catch (error) {
    console.error(`Error in GET /api/grading/${(await params).projectId}:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/grading/[projectId] - Delete a project grade
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const success = await deleteProjectGrade(projectId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Project grade not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Project grade deleted successfully' 
    });

  } catch (error) {
    console.error(`Error in DELETE /api/grading/${(await params).projectId}:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}