import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectLikes, projectLikeHistory, projects } from '@/lib/schema'
import { eq, and, count } from 'drizzle-orm'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    // Get student session from request headers or body
    const body = await request.json()
    const studentId = body.studentId

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 401 }
      )
    }

    // Check if project exists
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (project.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user already liked this project
    const existingLike = await db
      .select()
      .from(projectLikes)
      .where(
        and(
          eq(projectLikes.projectId, projectId),
          eq(projectLikes.studentId, studentId)
        )
      )
      .limit(1)

    let action: 'liked' | 'unliked'

    if (existingLike.length > 0) {
      // Unlike: Remove from likes and add to history
      await db.transaction(async (tx) => {
        await tx
          .delete(projectLikes)
          .where(
            and(
              eq(projectLikes.projectId, projectId),
              eq(projectLikes.studentId, studentId)
            )
          )

        await tx.insert(projectLikeHistory).values({
          projectId,
          studentId,
          action: 'unliked',
          createdAt: new Date(),
        })
      })
      action = 'unliked'
    } else {
      // Like: Add to likes and add to history
      await db.transaction(async (tx) => {
        await tx.insert(projectLikes).values({
          projectId,
          studentId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        await tx.insert(projectLikeHistory).values({
          projectId,
          studentId,
          action: 'liked',
          createdAt: new Date(),
        })
      })
      action = 'liked'
    }

    // Get updated like count
    const likeCountResult = await db
      .select({ count: count() })
      .from(projectLikes)
      .where(eq(projectLikes.projectId, projectId))

    return NextResponse.json({
      success: true,
      action,
      likeCount: likeCountResult[0].count,
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    // Get total like count
    const likeCountResult = await db
      .select({ count: count() })
      .from(projectLikes)
      .where(eq(projectLikes.projectId, projectId))

    let isLiked = false

    // Check if specific student has liked this project
    if (studentId) {
      const userLike = await db
        .select()
        .from(projectLikes)
        .where(
          and(
            eq(projectLikes.projectId, projectId),
            eq(projectLikes.studentId, studentId)
          )
        )
        .limit(1)

      isLiked = userLike.length > 0
    }

    return NextResponse.json({
      likeCount: likeCountResult[0].count,
      isLiked,
    })
  } catch (error) {
    console.error('Error fetching like status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}