import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projectMedia, projects } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

// DELETE /api/projects/[id]/media/[mediaId] - Delete a specific media from a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  try {
    const { id: projectId, mediaId } = await params;

    // Validate UUIDs
    if (!z.string().uuid().safeParse(projectId).success) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    if (!z.string().uuid().safeParse(mediaId).success) {
      return NextResponse.json(
        { error: 'Invalid media ID format' },
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

    // Check if media exists and belongs to the project
    const media = await db
      .select({ id: projectMedia.id })
      .from(projectMedia)
      .where(and(
        eq(projectMedia.id, mediaId),
        eq(projectMedia.projectId, projectId)
      ))
      .limit(1);

    if (media.length === 0) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // Delete the media
    await db
      .delete(projectMedia)
      .where(and(
        eq(projectMedia.id, mediaId),
        eq(projectMedia.projectId, projectId)
      ));

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting project media:', error);
    return NextResponse.json(
      { error: 'Failed to delete project media' },
      { status: 500 }
    );
  }
}