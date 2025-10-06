import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStudents, createStudentWithUser } from '@/lib/students';

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
});

export async function GET() {
  try {
    const students = await getStudents()
    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validatedData = createStudentSchema.parse(body)
    
    const student = await createStudentWithUser(validatedData)
    
    if (!student) {
      return NextResponse.json(
        { error: "Failed to create student" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    
    console.error("Error creating student:", error)
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    )
  }
}