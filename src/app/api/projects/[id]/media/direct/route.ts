import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projectMedia, projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// Zod schema for creating project media directly (without file upload)
const createProjectMediaDirectSchema = z.object({
  mediaUrl: z.string().url('Media URL must be a valid URL'),
  mediaType: z.enum(['image', 'video'], {
    message: 'Media type must be either "image" or "video"'
  }),
});

// POST /api/projects/[id]/media/direct - Add media to a project directly (without file upload)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const body = await request.json();

    // Validate UUID
    if (!z.string().uuid().safeParse(projectId).success) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Validate request data
    const validatedData = createProjectMediaDirectSchema.parse(body);

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

    // Create the project media record directly
    const [newMedia] = await db
      .insert(projectMedia)
      .values({
        projectId,
        mediaUrl: validatedData.mediaUrl,
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

    console.error('Error creating project media directly:', error);
    return NextResponse.json(
      { error: 'Failed to create project media' },
      { status: 500 }
    );
  }
}