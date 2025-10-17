import { NextResponse } from 'next/server';
import { getTopStudents } from '@/lib/top-content';
import { getCachedData } from '@/lib/cache';

export async function GET() {
  try {
    const topStudents = await getCachedData(
      'top-students',
      async () => {
        return await getTopStudents();
      },
      'medium' // 1 hour cache
    );

    return NextResponse.json({
      success: true,
      data: topStudents,
    });
  } catch (error) {
    console.error('Error in top-students API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch top students',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';