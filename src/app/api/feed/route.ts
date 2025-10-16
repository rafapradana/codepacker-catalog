import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, students, categories, projectTechstacks, projectMedia, techstacks, classes, users } from '@/lib/schema';
import { eq, desc, inArray } from 'drizzle-orm';

// GET /api/feed - Get latest projects from all students for the feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page: number = parseInt(searchParams.get('page') || '1');
    const limit: number = parseInt(searchParams.get('limit') || '10');
    
    const offset: number = (page - 1) * limit;

    // Get latest projects with student and category information
    const latestProjects = await db
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
          userId: students.userId,
          username: users.username,
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
      .orderBy(desc(projects.createdAt))
      .limit(limit + 1) // Get one extra to check if there are more
      .offset(offset);

    // Check if there are more projects
    const hasMore: boolean = latestProjects.length > limit;
    const projectsToReturn = hasMore ? latestProjects.slice(0, limit) : latestProjects;

    // Get project IDs for fetching relations
    const projectIds: string[] = projectsToReturn.map((p: any) => p.id);
    
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
      .where(inArray(projectTechstacks.projectId, projectIds));

    // Get all media for these projects
    const allProjectMedia = await db
      .select()
      .from(projectMedia)
      .where(inArray(projectMedia.projectId, projectIds));

    // Combine data
    const projectsWithRelations = projectsToReturn.map((project: any) => {
      const projectTechstacksList = allTechstacks.filter((pt: any) => pt.projectId === project.id);
      const projectMediaList = allProjectMedia.filter((pm: any) => pm.projectId === project.id);
      
      return {
        ...project,
        projectTechstacks: projectTechstacksList,
        projectMedia: projectMediaList,
      };
    });

    return NextResponse.json({
      projects: projectsWithRelations,
      hasMore
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}