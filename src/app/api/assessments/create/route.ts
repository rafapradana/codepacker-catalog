import { NextRequest, NextResponse } from 'next/server'
import { createProjectAssessment } from '@/lib/assessments'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('Creating assessment with data:', data)
    
    const result = await createProjectAssessment(data)
    console.log('Assessment created successfully:', result)
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}