import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projects, students, categories, projectTechstacks, projectMedia, techstacks, users, classes } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

// Zod schema for updating a project
const updateProjectSchema = z.object({
  studentId: z.string().uuid('Student ID must be a valid UUID').optional(),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().url('Thumbnail URL must be a valid URL').optional(),
  githubUrl: z.string().url('GitHub URL must be a valid URL').optional(),
  liveDemoUrl: z.string().url('Live Demo URL must be a valid URL').optional(),
  categoryId: z.string().uuid('Category ID must be a valid UUID').optional(),
});

// GET /api/projects/[id] - Get a specific project with all relations
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Validate UUID
    if (!z.string().uuid().safeParse(projectId).success) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Get project with relations
    const [project] = await db
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
          userId: students.userId,
          username: users.username,
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
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get project techstacks
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

    // Get project media
    const projectMediaList = await db
      .select()
      .from(projectMedia)
      .where(eq(projectMedia.projectId, projectId));

    const result = {
      ...project,
      techstacks: projectTechstacksList,
      media: projectMediaList,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
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

    // Validate request body
    const validatedData = updateProjectSchema.parse(body);

    // Check if project exists
    const existingProject = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Verify student exists if provided
    if (validatedData.studentId) {
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

    // Update the project
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Validate UUID
    if (!z.string().uuid().safeParse(projectId).success) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Check if project exists
    const existingProject = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete related records first (cascade delete)
    await db.delete(projectTechstacks).where(eq(projectTechstacks.projectId, projectId));
    await db.delete(projectMedia).where(eq(projectMedia.projectId, projectId));

    // Delete the project
    await db.delete(projects).where(eq(projects.id, projectId));

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}