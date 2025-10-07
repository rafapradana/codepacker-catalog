import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getStudentByUserId, getStudentSkills, addStudentSkill, removeStudentSkill } from "@/lib/students"

const addSkillSchema = z.object({
  skillId: z.string().uuid(),
})

const removeSkillSchema = z.object({
  skillId: z.string().uuid(),
})

// Get student skills
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const student = await getStudentByUserId(userId)
    
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    const skills = await getStudentSkills(student.id)
    
    return NextResponse.json({ skills })
  } catch (error) {
    console.error("Error fetching student skills:", error)
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    )
  }
}

// Add skill to student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = request.headers.get('x-user-id') || body.userId
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const student = await getStudentByUserId(userId)
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    const validatedData = addSkillSchema.parse(body)
    
    const result = await addStudentSkill(student.id, validatedData.skillId)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const skills = await getStudentSkills(student.id)
    
    return NextResponse.json({ 
      message: "Skill added successfully",
      skills 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    
    console.error("Error adding student skill:", error)
    return NextResponse.json(
      { error: "Failed to add skill" },
      { status: 500 }
    )
  }
}

// Remove skill from student
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = request.headers.get('x-user-id') || body.userId
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const student = await getStudentByUserId(userId)
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    const validatedData = removeSkillSchema.parse(body)
    
    const result = await removeStudentSkill(student.id, validatedData.skillId)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const skills = await getStudentSkills(student.id)
    
    return NextResponse.json({ 
      message: "Skill removed successfully",
      skills 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    
    console.error("Error removing student skill:", error)
    return NextResponse.json(
      { error: "Failed to remove skill" },
      { status: 500 }
    )
  }
}