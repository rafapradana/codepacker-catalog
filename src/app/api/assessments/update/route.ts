import { NextRequest, NextResponse } from 'next/server'
import { updateProjectAssessment } from '@/lib/assessments'

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const assessment = await updateProjectAssessment(data.id, data)
    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error updating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    )
  }
}