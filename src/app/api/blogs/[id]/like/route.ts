import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { blogs, blogLikes, students } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { withStudentAuth } from '@/lib/middleware';

// POST /api/blogs/[id]/like - Toggle like/unlike a blog
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withStudentAuth(request, async (request, { user }) => {
    try {
      const { id: blogId } = await params;

      // Validate UUID
      if (!z.string().uuid().safeParse(blogId).success) {
        return NextResponse.json(
          { error: 'Invalid blog ID format' },
          { status: 400 }
        );
      }

      // Verify blog exists and is published
      const [blog] = await db
        .select({ 
          id: blogs.id, 
          studentId: blogs.studentId,
          status: blogs.status,
          likeCount: blogs.likeCount
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

      if (blog.status !== 'published') {
        return NextResponse.json(
          { error: 'Cannot like unpublished blog' },
          { status: 400 }
        );
      }

      // Prevent self-liking
      if (blog.studentId === user.id) {
        return NextResponse.json(
          { error: 'Cannot like your own blog' },
          { status: 400 }
        );
      }

      // Check if user already liked this blog
      const [existingLike] = await db
        .select({ id: blogLikes.id })
        .from(blogLikes)
        .where(and(
          eq(blogLikes.blogId, blogId),
          eq(blogLikes.studentId, user.id)
        ))
        .limit(1);

      let isLiked: boolean;
      let newLikeCount: number;

      if (existingLike) {
        // Unlike: Remove the like
        await db
          .delete(blogLikes)
          .where(eq(blogLikes.id, existingLike.id));
        
        newLikeCount = Math.max(0, blog.likeCount - 1);
        isLiked = false;
      } else {
        // Like: Add the like
        await db
          .insert(blogLikes)
          .values({
            blogId,
            studentId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        
        newLikeCount = blog.likeCount + 1;
        isLiked = true;
      }

      // Update blog like count
      await db
        .update(blogs)
        .set({ 
          likeCount: newLikeCount,
          updatedAt: new Date()
        })
        .where(eq(blogs.id, blogId));

      return NextResponse.json({
        success: true,
        isLiked,
        likeCount: newLikeCount,
        message: isLiked ? 'Blog liked successfully' : 'Blog unliked successfully'
      });

    } catch (error) {
      console.error('Error toggling blog like:', error);
      return NextResponse.json(
        { error: 'Failed to toggle blog like' },
        { status: 500 }
      );
    }
  });
}

// GET /api/blogs/[id]/like - Check if current user liked this blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withStudentAuth(request, async (request, { user }) => {
    try {
      const { id: blogId } = await params;

      // Validate UUID
      if (!z.string().uuid().safeParse(blogId).success) {
        return NextResponse.json(
          { error: 'Invalid blog ID format' },
          { status: 400 }
        );
      }

      // Check if user liked this blog
      const [existingLike] = await db
        .select({ id: blogLikes.id })
        .from(blogLikes)
        .where(and(
          eq(blogLikes.blogId, blogId),
          eq(blogLikes.studentId, user.id)
        ))
        .limit(1);

      // Get current like count
      const [blog] = await db
        .select({ likeCount: blogs.likeCount })
        .from(blogs)
        .where(eq(blogs.id, blogId))
        .limit(1);

      return NextResponse.json({
        isLiked: !!existingLike,
        likeCount: blog?.likeCount || 0
      });

    } catch (error) {
      console.error('Error checking blog like status:', error);
      return NextResponse.json(
        { error: 'Failed to check blog like status' },
        { status: 500 }
      );
    }
  });
}