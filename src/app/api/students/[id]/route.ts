import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getStudentById, updateStudent, deleteStudent, updateStudentSkills } from "@/lib/students"

const updateStudentSchema = z.object({
  username: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  fullName: z.string().min(1).optional(),
  bio: z.string().optional(),
  profilePhotoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  classId: z.string().uuid().optional(),
  skillIds: z.array(z.string().uuid()).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await getStudentById(id)
    
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(student)
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    
    const validatedData = updateStudentSchema.parse(body)
    
    // Extract skillIds from validated data
    const { skillIds, ...studentData } = validatedData
    
    const student = await updateStudent(id, studentData)
    
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }
    
    // Update skills if skillIds are provided
    if (skillIds !== undefined) {
      await updateStudentSkills(id, skillIds)
    }
    
    // Return the updated student with skills
    const updatedStudent = await getStudentById(id)
    return NextResponse.json(updatedStudent)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    
    console.error("Error updating student:", error)
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteStudent(id)
    
    if (!success) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    )
  }
}