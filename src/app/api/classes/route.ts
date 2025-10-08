import { NextRequest, NextResponse } from 'next/server';
import { getClasses, createClass } from '@/lib/classes';

export async function GET() {
  try {
    const classes = await getClasses();
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { message: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { message: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const newClass = await createClass(name.trim());
    
    if (!newClass) {
      return NextResponse.json(
        { message: 'Failed to create class. Name might already exist.' },
        { status: 400 }
      );
    }

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { message: 'Failed to create class' },
      { status: 500 }
    );
  }
}