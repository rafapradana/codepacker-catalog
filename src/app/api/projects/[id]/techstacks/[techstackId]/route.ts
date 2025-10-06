import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projectTechstacks, projects } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

// DELETE /api/projects/[id]/techstacks/[techstackId] - Remove a techstack from a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; techstackId: string } }
) {
  try {
    const projectId = params.id;
    const techstackId = params.techstackId;

    // Validate UUIDs
    if (!z.string().uuid().safeParse(projectId).success) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    if (!z.string().uuid().safeParse(techstackId).success) {
      return NextResponse.json(
        { error: 'Invalid techstack ID format' },
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

    // Check if project techstack exists
    const projectTechstack = await db
      .select({ id: projectTechstacks.id })
      .from(projectTechstacks)
      .where(and(
        eq(projectTechstacks.projectId, projectId),
        eq(projectTechstacks.techstackId, techstackId)
      ))
      .limit(1);

    if (projectTechstack.length === 0) {
      return NextResponse.json(
        { error: 'Techstack not found in this project' },
        { status: 404 }
      );
    }

    // Remove the techstack from the project
    await db
      .delete(projectTechstacks)
      .where(and(
        eq(projectTechstacks.projectId, projectId),
        eq(projectTechstacks.techstackId, techstackId)
      ));

    return NextResponse.json({ message: 'Techstack removed from project successfully' });
  } catch (error) {
    console.error('Error removing techstack from project:', error);
    return NextResponse.json(
      { error: 'Failed to remove techstack from project' },
      { status: 500 }
    );
  }
}