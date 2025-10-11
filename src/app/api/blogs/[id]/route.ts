import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { blogs, students, users, classes, blogMedia, blogLikes } from '@/lib/schema';
import { eq, and, count } from 'drizzle-orm';
import { withStudentAuth } from '@/lib/middleware';

// Zod schema for updating a blog
const updateBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters").optional(),
  slug: z.string().min(1, "Slug is required").max(255, "Slug must be less than 255 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only").optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().max(500, "Excerpt must be less than 500 characters").optional(),
  thumbnailUrl: z.string().url("Thumbnail URL must be a valid URL").optional(),
  tags: z.array(z.string()).optional(),
  readTime: z.number().int().min(1, "Read time must be at least 1 minute").optional(),
  status: z.enum(['draft', 'published']).optional(),
  isPublic: z.boolean().optional(),
  publishedAt: z.date().optional()
});

// GET /api/blogs/[id] - Get a specific blog with all relations
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

    // Get blog with relations
    const [blog] = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        content: blogs.content,
        excerpt: blogs.excerpt,
        thumbnailUrl: blogs.thumbnailUrl,
        tags: blogs.tags,
        readTime: blogs.readTime,
        viewCount: blogs.viewCount,
        likeCount: blogs.likeCount,
        status: blogs.status,
        isPublic: blogs.isPublic,
        publishedAt: blogs.publishedAt,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        studentId: blogs.studentId, // Add studentId for ownership validation
        student: {
          id: students.id,
          fullName: students.fullName,
          profilePhotoUrl: students.profilePhotoUrl,
          userId: students.userId,
          username: users.username,
          className: classes.name,
        },
      })
      .from(blogs)
      .leftJoin(students, eq(blogs.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .where(eq(blogs.id, blogId))
      .limit(1);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Get blog media
    const blogMediaList = await db
      .select()
      .from(blogMedia)
      .where(eq(blogMedia.blogId, blogId))
      .orderBy(blogMedia.order);

    // Increment view count (only for published blogs)
    if (blog.status === 'published') {
      await db
        .update(blogs)
        .set({ 
          viewCount: blog.viewCount + 1,
          updatedAt: new Date()
        })
        .where(eq(blogs.id, blogId));
      
      // Update the blog object to reflect the new view count
      blog.viewCount += 1;
    }

    return NextResponse.json({
      ...blog,
      tags: blog.tags ? JSON.parse(blog.tags) : [],
      media: blogMediaList,
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update a specific blog
export async function PUT(
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

      const body = await request.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
      
      // Validate request body
      const validatedData = updateBlogSchema.parse(body);

      // Check if blog exists and belongs to the authenticated user
      const [existingBlog] = await db
        .select({ 
          id: blogs.id, 
          studentId: blogs.studentId,
          slug: blogs.slug,
          status: blogs.status
        })
        .from(blogs)
        .where(eq(blogs.id, blogId))
        .limit(1);

      if (!existingBlog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }

      if (existingBlog.studentId !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized to update this blog' },
          { status: 403 }
        );
      }

      // Check if slug is unique for this student (if slug is being updated)
      if (validatedData.slug && validatedData.slug !== existingBlog.slug) {
        const duplicateSlug = await db
          .select({ id: blogs.id })
          .from(blogs)
          .where(and(
            eq(blogs.slug, validatedData.slug),
            eq(blogs.studentId, user.id)
          ))
          .limit(1);

        if (duplicateSlug.length > 0) {
          return NextResponse.json(
            { error: 'A blog with this slug already exists' },
            { status: 409 }
          );
        }
      }

      // Handle publishedAt logic
      let publishedAt = validatedData.publishedAt;
      if (validatedData.status === 'published' && existingBlog.status === 'draft') {
        // First time publishing
        publishedAt = publishedAt || new Date();
      } else if (validatedData.status === 'draft') {
        // Unpublishing
        publishedAt = undefined;
      }

      // Update the blog
      const [updatedBlog] = await db
        .update(blogs)
        .set({
          ...validatedData,
          tags: validatedData.tags ? JSON.stringify(validatedData.tags) : undefined,
          publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, blogId))
        .returning();

      return NextResponse.json({
        ...updatedBlog,
        tags: updatedBlog.tags ? JSON.parse(updatedBlog.tags) : []
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.issues },
          { status: 400 }
        );
      }
      
      console.error('Error updating blog:', error);
      return NextResponse.json(
        { error: 'Failed to update blog' },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/blogs/[id] - Delete a specific blog
export async function DELETE(
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

      // Check if blog exists and belongs to the authenticated user
      const [existingBlog] = await db
        .select({ 
          id: blogs.id, 
          studentId: blogs.studentId 
        })
        .from(blogs)
        .where(eq(blogs.id, blogId))
        .limit(1);

      if (!existingBlog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }

      if (existingBlog.studentId !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized to delete this blog' },
          { status: 403 }
        );
      }

      // Delete related records first (cascade delete)
      await db.delete(blogMedia).where(eq(blogMedia.blogId, blogId));
      await db.delete(blogLikes).where(eq(blogLikes.blogId, blogId));

      // Delete the blog
      await db.delete(blogs).where(eq(blogs.id, blogId));

      return NextResponse.json(
        { message: 'Blog deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting blog:', error);
      return NextResponse.json(
        { error: 'Failed to delete blog' },
        { status: 500 }
      );
    }
  });
}