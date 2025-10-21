import { NextResponse } from 'next/server';
import { getTopStudents } from '@/lib/top-content';

export async function GET() {
  try {
    // Fetch data directly without caching for real-time updates
    const topStudents = await getTopStudents();

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