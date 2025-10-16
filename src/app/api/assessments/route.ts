import { NextRequest, NextResponse } from 'next/server'
import { getProjectsForAssessment, getUnassessedProjects } from '@/lib/assessments'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (type === 'unassessed') {
      const projects = await getUnassessedProjects()
      return NextResponse.json(projects)
    } else {
      const projects = await getProjectsForAssessment()
      return NextResponse.json(projects)
    }
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}