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
  mediaType: z.enum(['image', 'video'], {
    message: 'Media type must be either "image" or "video"'
  }),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const mediaType = formData.get('mediaType') as string;

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

    if (!mediaType) {
      return NextResponse.json(
        { error: 'Media type is required' },
        { status: 400 }
      );
    }

    // Validate request data
    const validation = uploadSchema.safeParse({ userId, mediaType });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Validate file using PROJECT_MEDIA options (supports both images and videos)
    const fileValidation = validateFile(file, FILE_VALIDATION_OPTIONS.PROJECT_MEDIA);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      );
    }

    // Generate file path with media type folder
    const filePath = generateFilePath(userId, file.name, `media/${mediaType}s`);

    // Upload file to Supabase storage
    const uploadResult = await uploadFile({
      bucket: STORAGE_BUCKETS.PROJECT_MEDIA,
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
      path: uploadResult.path,
      mediaType: validation.data.mediaType
    });

  } catch (error) {
    console.error('Error uploading project media:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}