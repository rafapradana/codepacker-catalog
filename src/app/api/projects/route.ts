import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projects, students, categories, projectTechstacks, projectMedia, techstacks, classes } from '@/lib/schema';
import { eq, desc, like, and, inArray } from 'drizzle-orm';
import { withStudentAuth } from '@/lib/middleware';

// Zod schema for creating a project
const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  thumbnailUrl: z.string().nullable().optional().transform(val => val === null || val === "" ? undefined : val),
  githubUrl: z.string().url("GitHub URL must be a valid URL"),
  liveDemoUrl: z.string().nullable().optional().transform(val => val === null || val === "" ? undefined : val).refine(val => val === undefined || z.string().url().safeParse(val).success, "Live Demo URL must be a valid URL"),
  categoryId: z.string().nullable().optional().transform(val => val === null || val === "" ? undefined : val),
  mediaUrls: z.array(z.string()).optional().default([]),
  techstackIds: z.array(z.string()).optional().default([])
});

// GET /api/projects - Get all projects with relations and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(like(projects.title, `%${search}%`));
    }
    
    if (categoryId) {
      whereConditions.push(eq(projects.categoryId, categoryId));
    }

    // Get projects with basic relations
    const projectsQuery = db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        thumbnailUrl: projects.thumbnailUrl,
        githubUrl: projects.githubUrl,
        liveDemoUrl: projects.liveDemoUrl,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        student: {
          id: students.id,
          fullName: students.fullName,
          profilePhotoUrl: students.profilePhotoUrl,
          classId: students.classId,
          className: classes.name,
        },
        category: {
          id: categories.id,
          name: categories.name,
          bgHex: categories.bgHex,
          borderHex: categories.borderHex,
          textHex: categories.textHex,
        },
      })
      .from(projects)
      .leftJoin(students, eq(projects.studentId, students.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .orderBy(desc(projects.createdAt));

    // Apply where conditions if any
    if (whereConditions.length > 0) {
      projectsQuery.where(and(...whereConditions));
    }

    // Get paginated results
    const paginatedProjects = await projectsQuery
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: projects.id })
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id));
    
    if (whereConditions.length > 0) {
      totalCountQuery.where(and(...whereConditions));
    }
    
    const totalCount = (await totalCountQuery).length;

    // Get project IDs for fetching relations
    const projectIds = paginatedProjects.map(p => p.id);
    
    if (projectIds.length === 0) {
      return NextResponse.json({
        projects: [],
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: false,
          hasPrev: page > 1
        }
      });
    }

    // Get all techstacks for these projects
    const allTechstacks = await db
      .select({
        projectId: projectTechstacks.projectId,
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
      .where(inArray(projectTechstacks.projectId, projectIds as string[]));

    // Get all media for these projects
    const allProjectMedia = await db
      .select()
      .from(projectMedia)
      .where(inArray(projectMedia.projectId, projectIds as string[]));

    // Combine data
    const projectsWithRelations = paginatedProjects.map(project => {
      const projectTechstacksList = allTechstacks.filter(pt => pt.projectId === project.id);
      const projectMediaList = allProjectMedia.filter(pm => pm.projectId === project.id);
      
      return {
        ...project,
        techstacks: projectTechstacksList,
        media: projectMediaList,
      };
    });

    return NextResponse.json({
      projects: projectsWithRelations,
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
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  return withStudentAuth(request, async (request, { user }) => {
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Validate request body
    const validatedData = createProjectSchema.parse(body);

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

    // Verify category exists if provided
    if (validatedData.categoryId) {
      const category = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, validatedData.categoryId))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // Create the project
    const [newProject] = await db
      .insert(projects)
      .values({
        ...validatedData,
        studentId: user.id, // Use authenticated user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newProject, { status: 201 });
  });
}