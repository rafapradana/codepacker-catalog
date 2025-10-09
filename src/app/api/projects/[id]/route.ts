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
        studentId: projects.studentId, // Add studentId for ownership validation
        categoryId: projects.categoryId, // Add categoryId for form population
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
        techstackId: projectTechstacks.techstackId, // Add techstackId for form population
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
      projectTechstacks: projectTechstacksList, // Use projectTechstacks instead of techstacks
      projectMedia: projectMediaList, // Use projectMedia instead of media
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

    // Check if request is FormData (for file uploads) or JSON
    const contentType = request.headers.get('content-type');
    const isFormData = contentType?.includes('multipart/form-data');

    if (isFormData) {
      // Handle FormData for file uploads
      const formData = await request.formData();
      
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const githubUrl = formData.get('githubUrl') as string;
      const liveDemoUrl = formData.get('liveDemoUrl') as string;
      const categoryId = formData.get('categoryId') as string;
      const techstackIdsString = formData.get('techstackIds') as string;
      
      // Parse techstack IDs
      let techstackIds: string[] = [];
      try {
        techstackIds = JSON.parse(techstackIdsString || '[]');
      } catch (error) {
        return NextResponse.json({ error: 'Invalid techstack IDs format' }, { status: 400 });
      }

      // Validate required fields
      if (!title?.trim()) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }

      if (!categoryId) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 });
      }

      if (techstackIds.length === 0) {
        return NextResponse.json({ error: 'At least one techstack is required' }, { status: 400 });
      }

      // Check if project exists
      const existingProject = await db
        .select({ 
          id: projects.id,
          thumbnailUrl: projects.thumbnailUrl,
          studentId: projects.studentId
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (existingProject.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      // Handle file uploads
      let thumbnailUrl = existingProject[0].thumbnailUrl;
      const mediaUrls: string[] = [];

      // Handle thumbnail upload
      const thumbnailFile = formData.get('thumbnail') as File;
      if (thumbnailFile && thumbnailFile.size > 0) {
        // In a real app, you'd upload to cloud storage
        // For now, we'll just use a placeholder URL
        thumbnailUrl = `/uploads/projects/thumbnail-${Date.now()}.jpg`;
      }

      // Handle media uploads
      const mediaFiles: File[] = [];
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('media_') && value instanceof File && value.size > 0) {
          mediaFiles.push(value);
        }
      }

      for (const mediaFile of mediaFiles) {
        // In a real app, you'd upload to cloud storage
        mediaUrls.push(`/uploads/projects/media-${Date.now()}-${Math.random()}.jpg`);
      }

      // Update project in database transaction
      await db.transaction(async (tx) => {
        // Update project basic info
        await tx
          .update(projects)
          .set({
            title: title.trim(),
            description: description?.trim() || undefined,
             githubUrl: githubUrl?.trim() || undefined,
             liveDemoUrl: liveDemoUrl?.trim() || undefined,
            categoryId,
            thumbnailUrl,
            updatedAt: new Date(),
          })
          .where(eq(projects.id, projectId));

        // Update techstacks - remove old ones and add new ones
        await tx.delete(projectTechstacks).where(eq(projectTechstacks.projectId, projectId));

        if (techstackIds.length > 0) {
          await tx.insert(projectTechstacks).values(
            techstackIds.map(techstackId => ({
              projectId,
              techstackId,
            }))
          );
        }

        // Add new media files (keep existing ones)
         if (mediaUrls.length > 0) {
           await tx.insert(projectMedia).values(
             mediaUrls.map(mediaUrl => ({
               projectId,
               mediaUrl,
               mediaType: 'image', // Default to image type
             }))
           );
         }
      });

      // Fetch updated project with relations
      const result = await GET(request, { params });
      return result;

    } else {
      // Handle JSON for simple updates (backward compatibility)
      const body = await request.json();
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
     }
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