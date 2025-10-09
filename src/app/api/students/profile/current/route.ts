import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, students, classes, studentSkills, skills, projects, categories, projectTechstacks, techstacks } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Extract the user ID from the Bearer token
    const userId = authHeader.replace('Bearer ', '')

    // Fetch student data with user and class information
    const studentResult = await db
      .select({
        id: students.id,
        fullName: students.fullName,
        bio: students.bio,
        profilePhotoUrl: students.profilePhotoUrl,
        githubUrl: students.githubUrl,
        linkedinUrl: students.linkedinUrl,
        createdAt: students.createdAt,
        user: {
          username: users.username,
          email: users.email,
        },
        class: {
          name: classes.name,
        },
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .where(eq(students.userId, userId))
      .limit(1)

    if (studentResult.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    const student = studentResult[0]

    // Fetch student skills
    const studentSkillsResult = await db
      .select({
        skill: {
          id: skills.id,
          name: skills.name,
          iconUrl: skills.iconUrl,
          bgHex: skills.bgHex,
          borderHex: skills.borderHex,
          textHex: skills.textHex,
        },
      })
      .from(studentSkills)
      .leftJoin(skills, eq(studentSkills.skillId, skills.id))
      .where(eq(studentSkills.studentId, student.id))

    // Fetch projects for the student
    const projectsResult = await db
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
      .where(eq(projects.studentId, student.id))
      .orderBy(desc(projects.createdAt))

    // Fetch techstacks for each project
    const projectsWithTechstacks = await Promise.all(
      projectsResult.map(async (project) => {
        const techstacksResult = await db
          .select({
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
          .where(eq(projectTechstacks.projectId, project.id))

        return {
          ...project,
          projectTechstacks: techstacksResult,
        }
      })
    )

    // Combine all data
    const studentProfile = {
      ...student,
      studentSkills: studentSkillsResult,
      projects: projectsWithTechstacks,
    }

    return NextResponse.json(studentProfile)
  } catch (error) {
    console.error('Error fetching current student profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}