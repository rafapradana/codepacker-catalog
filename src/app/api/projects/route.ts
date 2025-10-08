import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projects, students, categories, projectTechstacks, projectMedia, techstacks } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

// Zod schema for creating a project
const createProjectSchema = z.object({
  studentId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  thumbnailUrl: z.string().nullable().optional().transform(val => val === null || val === "" ? undefined : val),
  githubUrl: z.string().url("GitHub URL must be a valid URL"),
  liveDemoUrl: z.string().nullable().optional().transform(val => val === null || val === "" ? undefined : val).refine(val => val === undefined || z.string().url().safeParse(val).success, "Live Demo URL must be a valid URL"),
  categoryId: z.string().nullable().optional().transform(val => val === null || val === "" ? undefined : val),
  mediaUrls: z.array(z.string()).optional().default([]),
  techstackIds: z.array(z.string()).optional().default([])
});

// GET /api/projects - Get all projects with relations
export async function GET() {
  try {
    // Get all projects with basic relations
    const allProjects = await db
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
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .orderBy(desc(projects.createdAt));

    // Get media and techstacks for all projects
    const projectIds = allProjects.map(p => p.id);
    
    // Get all media for these projects
    const allMedia = await db
      .select()
      .from(projectMedia)
      .where(eq(projectMedia.projectId, projectIds[0])); // This won't work for multiple IDs

    // Get all techstacks for these projects  
    const allTechstacks = await db
      .select({
        projectId: projectTechstacks.projectId,
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
      .leftJoin(techstacks, eq(projectTechstacks.techstackId, techstacks.id));

    // Get all media for these projects
    const allProjectMedia = await db
      .select()
      .from(projectMedia);

    // Combine data
    const projectsWithRelations = allProjects.map(project => {
      const projectTechstacksList = allTechstacks.filter(pt => pt.projectId === project.id);
      const projectMediaList = allProjectMedia.filter(pm => pm.projectId === project.id);
      
      return {
        ...project,
        techstacks: projectTechstacksList,
        media: projectMediaList,
      };
    });

    return NextResponse.json(projectsWithRelations);
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
  try {
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Validate request body
    const validatedData = createProjectSchema.parse(body);

    // Verify student exists
    const student = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.id, validatedData.studentId))
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
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('Validation error:', JSON.stringify(error.issues, null, 2));
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}