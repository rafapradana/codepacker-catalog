import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { uploadFile, generateFilePath, validateFile, FILE_VALIDATION_OPTIONS, STORAGE_BUCKETS } from '@/lib/storage';

const uploadSchema = z.object({
  file: z.instanceof(File),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const validation = validateFile(file, FILE_VALIDATION_OPTIONS.ICON);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate unique file path
    const filePath = generateFilePath('system', file.name, 'skill-icons');

    // Upload file to storage
    const uploadResult = await uploadFile({
      bucket: STORAGE_BUCKETS.SKILL_ICONS,
      path: filePath,
      file,
      upsert: false
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

  } catch (error: any) {
    console.error('Error uploading skill icon:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}