import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStudents, createStudentWithUser } from '@/lib/students';
import { getStudentsWithRelations } from '@/lib/students-with-relations';

const createStudentSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  bio: z.string().optional(),
  profilePhotoUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  classId: z.string().nullable().optional(),
  skillIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withRelations = searchParams.get('withRelations') === 'true';
    
    if (withRelations) {
      const students = await getStudentsWithRelations();
      return NextResponse.json(students);
    } else {
      const students = await getStudents();
      return NextResponse.json(students);
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createStudentSchema.parse(body);
    
    const student = await createStudentWithUser(validatedData);
    
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}