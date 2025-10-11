import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { blogs, blogMedia } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { withStudentAuth } from '@/lib/middleware';
import { deleteFile, STORAGE_BUCKETS } from '@/lib/storage';

// GET /api/blogs/[id]/media - Get all media for a specific blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: blogId } = await params;

    // Validate UUID
    if (!z.string().uuid().safeParse(blogId).success) {
      return NextResponse.json(
        { error: 'Invalid blog ID format' },
        { status: 400 }
      );
    }

    // Verify blog exists
    const [blog] = await db
      .select({ 
        id: blogs.id,
        studentId: blogs.studentId,
        status: blogs.status
      })
      .from(blogs)
      .where(eq(blogs.id, blogId))
      .limit(1);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Get all media for this blog
    const mediaList = await db
      .select()
      .from(blogMedia)
      .where(eq(blogMedia.blogId, blogId))
      .orderBy(blogMedia.order, blogMedia.createdAt);

    return NextResponse.json({
      media: mediaList,
      total: mediaList.length
    });

  } catch (error) {
    console.error('Error fetching blog media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog media' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id]/media - Delete specific media from a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withStudentAuth(request, async (request, { user }) => {
    try {
      const { id: blogId } = await params;
      const { searchParams } = new URL(request.url);
      const mediaId = searchParams.get('mediaId');

      // Validate UUIDs
      if (!z.string().uuid().safeParse(blogId).success) {
        return NextResponse.json(
          { error: 'Invalid blog ID format' },
          { status: 400 }
        );
      }

      if (!mediaId || !z.string().uuid().safeParse(mediaId).success) {
        return NextResponse.json(
          { error: 'Valid media ID is required' },
          { status: 400 }
        );
      }

      // Verify blog exists and belongs to the authenticated user
      const [blog] = await db
        .select({ 
          id: blogs.id, 
          studentId: blogs.studentId 
        })
        .from(blogs)
        .where(eq(blogs.id, blogId))
        .limit(1);

      if (!blog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }

      if (blog.studentId !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized to delete media from this blog' },
          { status: 403 }
        );
      }

      // Get media record
      const [media] = await db
        .select()
        .from(blogMedia)
        .where(and(
          eq(blogMedia.id, mediaId),
          eq(blogMedia.blogId, blogId)
        ))
        .limit(1);

      if (!media) {
        return NextResponse.json(
          { error: 'Media not found' },
          { status: 404 }
        );
      }

      // Extract file path from URL for deletion
      const urlParts = media.fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${blogId}/media/${fileName}`;

      // Delete file from storage
      const deleteResult = await deleteFile(STORAGE_BUCKETS.BLOG_MEDIA, filePath);

      // Delete media record from database (even if file deletion fails)
      await db
        .delete(blogMedia)
        .where(eq(blogMedia.id, mediaId));

      return NextResponse.json({
        success: true,
        message: 'Media deleted successfully',
        fileDeleted: deleteResult.success
      });

    } catch (error) {
      console.error('Error deleting blog media:', error);
      return NextResponse.json(
        { error: 'Failed to delete blog media' },
        { status: 500 }
      );
    }
  });
}