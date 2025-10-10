import { NextResponse } from "next/server"
import { getUngradedProjectsCount } from "@/lib/project-grading"

export async function GET() {
  try {
    const count = await getUngradedProjectsCount()
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error getting ungraded projects count:", error)
    return NextResponse.json(
      { error: "Failed to get ungraded projects count" },
      { status: 500 }
    )
  }
}