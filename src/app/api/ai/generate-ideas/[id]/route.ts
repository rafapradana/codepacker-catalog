import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { aiProjectIdeas } from '@/lib/schema'
import { eq } from 'drizzle-orm'

// PATCH endpoint to update bookmark status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isBookmarked } = await request.json()
    const resolvedParams = await params
    const ideaId = resolvedParams.id

    if (typeof isBookmarked !== 'boolean') {
      return NextResponse.json(
        { error: 'isBookmarked must be a boolean' },
        { status: 400 }
      )
    }

    // Update the bookmark status
    const updatedIdea = await db
      .update(aiProjectIdeas)
      .set({ 
        isBookmarked,
        updatedAt: new Date()
      })
      .where(eq(aiProjectIdeas.id, ideaId))
      .returning()

    if (updatedIdea.length === 0) {
      return NextResponse.json(
        { error: 'Project idea not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      idea: {
        ...updatedIdea[0],
        techStack: JSON.parse(updatedIdea[0].techStack || '[]'),
        features: JSON.parse(updatedIdea[0].features || '[]'),
      }
    })

  } catch (error) {
    console.error('Error updating bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to update bookmark' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to delete a project idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const ideaId = resolvedParams.id

    // Delete the project idea
    const deletedIdea = await db
      .delete(aiProjectIdeas)
      .where(eq(aiProjectIdeas.id, ideaId))
      .returning()

    if (deletedIdea.length === 0) {
      return NextResponse.json(
        { error: 'Project idea not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project idea deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting project idea:', error)
    return NextResponse.json(
      { error: 'Failed to delete project idea' },
      { status: 500 }
    )
  }
}