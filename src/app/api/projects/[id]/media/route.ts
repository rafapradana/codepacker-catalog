import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projectMedia, projects } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

// Zod schema for creating project media via file upload
const createProjectMediaSchema = z.object({
  mediaType: z.enum(['image', 'video'], {
    message: 'Media type must be either "image" or "video"'
  }),
});

// GET /api/projects/[id]/media - Get all media for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    // Validate UUID
    if (!z.string().uuid().safeParse(projectId).success) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get all media for the project
    const media = await db
      .select()
      .from(projectMedia)
      .where(eq(projectMedia.projectId, projectId))
      .orderBy(desc(projectMedia.createdAt));

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching project media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project media' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/media - Add media to a project via file upload
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const mediaType = formData.get('mediaType') as string;
    const userId = formData.get('userId') as string;

    // Validate UUID
    if (!z.string().uuid().safeParse(projectId).success) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!mediaType) {
      return NextResponse.json(
        { error: 'Media type is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate request data
    const validatedData = createProjectMediaSchema.parse({ mediaType });

    // Check if project exists
    const project = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Upload file to storage first
    const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload/project-media`, {
      method: 'POST',
      body: (() => {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('mediaType', mediaType);
        uploadFormData.append('userId', userId);
        return uploadFormData;
      })()
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.json();
      return NextResponse.json(
        { error: uploadError.error || 'Failed to upload file' },
        { status: uploadResponse.status }
      );
    }

    const uploadResult = await uploadResponse.json();

    // Create the project media record with the uploaded file URL
    const [newMedia] = await db
      .insert(projectMedia)
      .values({
        projectId,
        mediaUrl: uploadResult.url,
        mediaType: validatedData.mediaType,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating project media:', error);
    return NextResponse.json(
      { error: 'Failed to create project media' },
      { status: 500 }
    );
  }
}