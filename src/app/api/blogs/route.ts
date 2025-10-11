import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { blogs, students, users, classes, blogLikes } from '@/lib/schema';
import { eq, desc, like, and, count, sql } from 'drizzle-orm';
import { withStudentAuth } from '@/lib/middleware';

// Zod schema for creating a blog
const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  slug: z.string().min(1, "Slug is required").max(255, "Slug must be less than 255 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt must be less than 500 characters").optional(),
  thumbnailUrl: z.string().url("Thumbnail URL must be a valid URL").optional(),
  tags: z.array(z.string()).optional().default([]),
  readTime: z.number().int().min(1, "Read time must be at least 1 minute").optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  isPublic: z.boolean().default(true),
  publishedAt: z.date().optional()
});

// GET /api/blogs - Get all blogs with relations and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const studentId = searchParams.get('studentId') || '';
    const tag = searchParams.get('tag') || '';
    
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        sql`(${blogs.title} ILIKE ${`%${search}%`} OR ${blogs.excerpt} ILIKE ${`%${search}%`})`
      );
    }
    
    if (status && ['draft', 'published'].includes(status)) {
      whereConditions.push(eq(blogs.status, status as 'draft' | 'published'));
    }
    
    if (studentId) {
      whereConditions.push(eq(blogs.studentId, studentId));
    }
    
    if (tag) {
      whereConditions.push(sql`${tag} = ANY(${blogs.tags})`);
    }

    // Only show public blogs unless filtering by specific student
    if (!studentId) {
      whereConditions.push(eq(blogs.isPublic, true));
    }

    // Get blogs with basic relations
    const blogsQuery = db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
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
        student: {
          id: students.id,
          fullName: students.fullName,
          profilePhotoUrl: students.profilePhotoUrl,
          classId: students.classId,
          className: classes.name,
          username: users.username,
        },
      })
      .from(blogs)
      .leftJoin(students, eq(blogs.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .orderBy(desc(blogs.createdAt));

    // Apply where conditions if any
    if (whereConditions.length > 0) {
      blogsQuery.where(and(...whereConditions));
    }

    // Get paginated results
    const paginatedBlogs = await blogsQuery
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: count() })
      .from(blogs)
      .leftJoin(students, eq(blogs.studentId, students.id));
    
    if (whereConditions.length > 0) {
      totalCountQuery.where(and(...whereConditions));
    }
    
    const [{ count: totalCount }] = await totalCountQuery;

    return NextResponse.json({
      blogs: paginatedBlogs.map(blog => ({
        ...blog,
        tags: blog.tags ? JSON.parse(blog.tags) : []
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  return withStudentAuth(request, async (request, { user }) => {
    try {
      const body = await request.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
      
      // Validate request body
      const validatedData = createBlogSchema.parse(body);

      // Verify student exists (using authenticated user ID)
      const student = await db
        .select({ id: students.id })
        .from(students)
        .where(eq(students.id, user.id))
        .limit(1);

      if (student.length === 0) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        );
      }

      // Check if slug is unique for this student
      const existingBlog = await db
        .select({ id: blogs.id })
        .from(blogs)
        .where(and(
          eq(blogs.slug, validatedData.slug),
          eq(blogs.studentId, user.id)
        ))
        .limit(1);

      if (existingBlog.length > 0) {
        return NextResponse.json(
          { error: 'A blog with this slug already exists' },
          { status: 409 }
        );
      }

      // Set publishedAt if status is published
      const publishedAt = validatedData.status === 'published' 
        ? validatedData.publishedAt || new Date() 
        : null;

      // Create the blog
      const [newBlog] = await db
        .insert(blogs)
        .values({
          ...validatedData,
          tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
          studentId: user.id,
          publishedAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return NextResponse.json({
        ...newBlog,
        tags: newBlog.tags ? JSON.parse(newBlog.tags) : []
      }, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.issues },
          { status: 400 }
        );
      }
      
      console.error('Error creating blog:', error);
      return NextResponse.json(
        { error: 'Failed to create blog' },
        { status: 500 }
      );
    }
  });
}