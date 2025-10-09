import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projectTechstacks, projects, techstacks } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';

// Zod schema for adding techstack to project
const addProjectTechstackSchema = z.object({
  techstackId: z.string().uuid('Techstack ID must be a valid UUID'),
});

// GET /api/projects/[id]/techstacks - Get all techstacks for a project
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

    // Get all techstacks for the project
    const projectTechstacksList = await db
      .select({
        id: projectTechstacks.id,
        techstack: {
          id: techstacks.id,
          name: techstacks.name,
          iconUrl: techstacks.iconUrl,
          bgHex: techstacks.bgHex,
          borderHex: techstacks.borderHex,
          textHex: techstacks.textHex,
        },
      })
      .from(projectTechstacks)
      .leftJoin(techstacks, eq(projectTechstacks.techstackId, techstacks.id))
      .where(eq(projectTechstacks.projectId, projectId));

    return NextResponse.json(projectTechstacksList);
  } catch (error) {
    console.error('Error fetching project techstacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project techstacks' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/techstacks - Add techstack to a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();

    // Validate UUID
    if (!z.string().uuid().safeParse(projectId).success) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Validate request body
    const validatedData = addProjectTechstackSchema.parse(body);

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

    // Check if techstack exists
    const techstack = await db
      .select({ id: techstacks.id })
      .from(techstacks)
      .where(eq(techstacks.id, validatedData.techstackId))
      .limit(1);

    if (techstack.length === 0) {
      return NextResponse.json(
        { error: 'Techstack not found' },
        { status: 404 }
      );
    }

    // Check if techstack is already added to the project
    const existingProjectTechstack = await db
      .select({ id: projectTechstacks.id })
      .from(projectTechstacks)
      .where(
        and(
          eq(projectTechstacks.projectId, projectId),
          eq(projectTechstacks.techstackId, validatedData.techstackId)
        )
      )
      .limit(1);

    if (existingProjectTechstack.length > 0) {
      return NextResponse.json(
        { error: 'Techstack already added to this project' },
        { status: 409 }
      );
    }

    // Add the techstack to the project
    const [newProjectTechstack] = await db
      .insert(projectTechstacks)
      .values({
        projectId,
        techstackId: validatedData.techstackId,
      })
      .returning();

    return NextResponse.json(newProjectTechstack, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error adding techstack to project:', error);
    return NextResponse.json(
      { error: 'Failed to add techstack to project' },
      { status: 500 }
    );
  }
}