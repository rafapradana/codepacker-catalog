import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects as projectsTable, students, categories, projectTechstacks, projectMedia, techstacks, classes } from '@/lib/schema';
import { eq, desc, like, and, inArray, or } from 'drizzle-orm';

// GET /api/projects/search - Search and explore projects with advanced filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page: number = parseInt(searchParams.get('page') || '1');
    const limit: number = parseInt(searchParams.get('limit') || '9'); // 9 cards per page (3x3 grid)
    const search: string = searchParams.get('search') || '';
    const categoryId: string = searchParams.get('categoryId') || '';
    
    const offset: number = (page - 1) * limit;

    // Build where conditions for advanced search
    const whereConditions: any[] = [];
    
    if (search) {
      // Search in project title, description, and student name
      whereConditions.push(
        or(
          like(projectsTable.title, `%${search}%`),
          like(projectsTable.description, `%${search}%`),
          like(students.fullName, `%${search}%`)
        )
      );
    }
    
    if (categoryId) {
      whereConditions.push(eq(projectsTable.categoryId, categoryId));
    }

    // Get projects with all relations
    const projectsQuery = db
      .select({
        id: projectsTable.id,
        title: projectsTable.title,
        description: projectsTable.description,
        thumbnailUrl: projectsTable.thumbnailUrl,
        githubUrl: projectsTable.githubUrl,
        liveDemoUrl: projectsTable.liveDemoUrl,
        createdAt: projectsTable.createdAt,
        updatedAt: projectsTable.updatedAt,
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
      .from(projectsTable)
      .leftJoin(students, eq(projectsTable.studentId, students.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(categories, eq(projectsTable.categoryId, categories.id))
      .orderBy(desc(projectsTable.updatedAt));

    // Apply where conditions if any
    if (whereConditions.length > 0) {
      projectsQuery.where(and(...whereConditions));
    }

    // Get projects with limit + 1 to check if there are more
    const paginatedProjects: any[] = await projectsQuery
      .limit(limit + 1)
      .offset(offset);

    // Check if there are more projects
    const hasMore: boolean = paginatedProjects.length > limit;
    const projects: any[] = hasMore ? paginatedProjects.slice(0, limit) : paginatedProjects;

    // Get project IDs for fetching relations
    const projectIds: string[] = projects.map((p: any) => p.id);
    
    if (projectIds.length === 0) {
      return NextResponse.json({
        projects: [],
        hasMore: false
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
    const projectsWithRelations = projects.map((project: any) => {
      const projectTechstacksList = allTechstacks.filter((pt: any) => pt.projectId === project.id);
      const projectMediaList = allProjectMedia.filter((pm: any) => pm.projectId === project.id);
      
      return {
        ...project,
        techstacks: projectTechstacksList,
        media: projectMediaList,
      };
    });

    return NextResponse.json({
      projects: projectsWithRelations,
      hasMore
    });
  } catch (error) {
    console.error('Error searching projects:', error);
    return NextResponse.json(
      { error: 'Failed to search projects' },
      { status: 500 }
    );
  }
}