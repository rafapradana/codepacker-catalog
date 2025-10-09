import { NextRequest, NextResponse } from 'next/server';
import { getClassById, updateClass, deleteClass } from '@/lib/classes';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const classItem = await getClassById(id);
    
    if (!classItem) {
      return NextResponse.json(
        { message: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(classItem);
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json(
      { message: 'Failed to fetch class' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await request.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { message: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const updatedClass = await updateClass(id, name.trim());
    
    if (!updatedClass) {
      return NextResponse.json(
        { message: 'Failed to update class. Class not found or name already exists.' },
        { status: 400 }
      );
    }

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { message: 'Failed to update class' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteClass(id);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to delete class. Class not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { message: 'Failed to delete class' },
      { status: 500 }
    );
  }
}