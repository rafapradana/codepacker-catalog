import { NextResponse } from 'next/server';
import { getTopProjects } from '@/lib/top-content';
import { getCachedData } from '@/lib/cache';

export async function GET() {
  try {
    const topProjects = await getCachedData(
      'top-projects',
      async () => {
        return await getTopProjects();
      },
      'medium' // 1 hour cache
    );

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