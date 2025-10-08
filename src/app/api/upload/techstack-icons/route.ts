import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, generateFilePath, STORAGE_BUCKETS } from '@/lib/storage';

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
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }
    
    // Generate unique file path
    const filePath = generateFilePath('system', file.name, 'techstack-icons');
    
    // Upload file to techstack-icons bucket
    const result = await uploadFile({
      bucket: STORAGE_BUCKETS.TECHSTACK_ICONS,
      path: filePath,
      file: file,
      upsert: true
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to upload file' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ url: result.url }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file: ' + error.message },
      { status: 500 }
    );
  }
}