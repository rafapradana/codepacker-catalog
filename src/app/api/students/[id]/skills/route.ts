import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getStudentSkills, addStudentSkill, removeStudentSkill } from "@/lib/students"

const addSkillSchema = z.object({
  skillId: z.string().uuid("Invalid skill ID format"),
})

const removeSkillSchema = z.object({
  skillId: z.string().uuid("Invalid skill ID format"),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const skills = await getStudentSkills(id)
    return NextResponse.json(skills)
  } catch (error) {
    console.error("Error fetching student skills:", error)
    return NextResponse.json(
      { error: "Failed to fetch student skills" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    
    const validatedData = addSkillSchema.parse(body)
    
    const result = await addStudentSkill(id, validatedData.skillId)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Student not found" || result.error === "Skill not found" ? 404 : 400 }
      )
    }
    
    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    
    console.error("Error adding student skill:", error)
    return NextResponse.json(
      { error: "Failed to add student skill" },
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
    const body = await request.json()
    
    const validatedData = removeSkillSchema.parse(body)
    
    const result = await removeStudentSkill(id, validatedData.skillId)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Student skill not found" ? 404 : 400 }
      )
    }
    
    return NextResponse.json({ message: "Student skill removed successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    
    console.error("Error removing student skill:", error)
    return NextResponse.json(
      { error: "Failed to remove student skill" },
      { status: 500 }
    )
  }
}