import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  uploadFile, 
  generateFilePath, 
  validateFile, 
  FILE_VALIDATION_OPTIONS,
  STORAGE_BUCKETS 
} from '@/lib/storage';

// Zod schema for upload request
const uploadSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate userId format
    const userIdValidation = uploadSchema.safeParse({ userId });
    if (!userIdValidation.success) {
      return NextResponse.json(
        { error: 'Invalid user ID format', details: userIdValidation.error.issues },
        { status: 400 }
      );
    }

    // Validate file
    const fileValidation = validateFile(file, FILE_VALIDATION_OPTIONS.PROJECT_THUMBNAIL);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      );
    }

    // Generate file path
    const filePath = generateFilePath(userId, file.name, 'thumbnails');

    // Upload file to Supabase storage
    const uploadResult = await uploadFile({
      bucket: STORAGE_BUCKETS.PROJECT_THUMBNAILS,
      path: filePath,
      file,
      upsert: true
    });

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Failed to upload file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      path: uploadResult.path
    });

  } catch (error) {
    console.error('Error uploading project thumbnail:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}