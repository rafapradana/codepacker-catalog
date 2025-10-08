import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStudentByUserId, updateStudent } from "@/lib/students";
import { getStudentSkills } from "@/lib/students";

const updateProfileSchema = z.object({
  fullName: z.string().min(1).optional(),
  bio: z.string().optional(),
  profilePhotoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  classId: z.string().uuid().optional(),
});

// Get current student profile
export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameters (sent from frontend)
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const student = await getStudentByUserId(userId);
    
    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Get student skills
    const skills = await getStudentSkills(student.id);
    
    return NextResponse.json({
      student: {
        ...student,
        skills
      }
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// Update student profile
export async function PUT(request: NextRequest) {
  try {
    // Get userId from query parameters (sent from frontend)
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // First, get the student by userId to get the student ID
    const student = await getStudentByUserId(userId);
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedStudent = await updateStudent(student.id, validatedData);
    
    if (!updatedStudent) {
      return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
    }

    // Fetch skills for the updated student
    const skills = await getStudentSkills(updatedStudent.id);

    return NextResponse.json({
      student: {
        ...updatedStudent,
        skills
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 });
    }
    console.error('Error updating student profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}