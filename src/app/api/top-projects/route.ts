import { NextResponse } from 'next/server';
import { getTopProjects } from '@/lib/top-content';

export async function GET() {
  try {
    // Fetch data directly without caching for real-time updates
    const topProjects = await getTopProjects();

    return NextResponse.json({
      success: true,
      data: topProjects,
    });
  } catch (error) {
    console.error('Error in top-projects API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch top projects',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';