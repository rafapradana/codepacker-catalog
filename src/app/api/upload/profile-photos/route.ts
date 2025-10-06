import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { uploadFile, validateFile, FILE_VALIDATION_OPTIONS, STORAGE_BUCKETS } from "@/lib/storage"

const uploadSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file, FILE_VALIDATION_OPTIONS.PROFILE_PHOTO)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Generate unique file path
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `profile-${timestamp}.${extension}`
    const filePath = `students/${fileName}`

    // Upload file
    const result = await uploadFile({
      bucket: STORAGE_BUCKETS.PROFILE_PHOTOS,
      path: filePath,
      file,
      upsert: false
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to upload file" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: result.url,
      path: result.path,
      message: "Profile photo uploaded successfully"
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error uploading profile photo:", error)
    return NextResponse.json(
      { error: "Failed to upload profile photo" },
      { status: 500 }
    )
  }
}