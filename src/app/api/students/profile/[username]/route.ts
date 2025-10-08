import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { students, users, classes, studentSkills, skills, projects, categories, projectTechstacks, techstacks } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Get student with all relations
    const studentData = await db
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
      .innerJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .where(eq(users.username, username))
      .limit(1)

    if (studentData.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    const student = studentData[0]

    // Get student skills
    const studentSkillsData = await db
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
      .innerJoin(skills, eq(studentSkills.skillId, skills.id))
      .where(eq(studentSkills.studentId, student.id))

    // Get student projects with categories and techstacks
    const projectsData = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        thumbnailUrl: projects.thumbnailUrl,
        githubUrl: projects.githubUrl,
        liveDemoUrl: projects.liveDemoUrl,
        createdAt: projects.createdAt,
        category: {
          name: categories.name,
          bgHex: categories.bgHex,
          borderHex: categories.borderHex,
          textHex: categories.textHex,
        },
      })
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(eq(projects.studentId, student.id))
      .orderBy(projects.createdAt)

    // Get techstacks for each project
    const projectsWithTechstacks = await Promise.all(
      projectsData.map(async (project) => {
        const techstacksData = await db
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
          .innerJoin(techstacks, eq(projectTechstacks.techstackId, techstacks.id))
          .where(eq(projectTechstacks.projectId, project.id))

        return {
          ...project,
          projectTechstacks: techstacksData,
        }
      })
    )

    // Combine all data
    const result = {
      ...student,
      studentSkills: studentSkillsData,
      projects: projectsWithTechstacks,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching student profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}