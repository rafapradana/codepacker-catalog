import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  uploadFile, 
  generateFilePath, 
  validateFile, 
  FILE_VALIDATION_OPTIONS,
  STORAGE_BUCKETS 
} from '@/lib/storage';
import { withStudentAuth } from '@/lib/middleware';

// Zod schema for upload request
const uploadSchema = z.object({
  blogId: z.string().uuid('Blog ID must be a valid UUID').optional(),
});

export async function POST(request: NextRequest) {
  return withStudentAuth(request, async (request, { user }) => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const blogId = formData.get('blogId') as string;

      // Validate required fields
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate blogId format if provided
      if (blogId) {
        const blogIdValidation = uploadSchema.safeParse({ blogId });
        if (!blogIdValidation.success) {
          return NextResponse.json(
            { error: 'Invalid blog ID format', details: blogIdValidation.error.issues },
            { status: 400 }
          );
        }
      }

      // Validate file
      const fileValidation = validateFile(file, FILE_VALIDATION_OPTIONS.BLOG_THUMBNAIL);
      if (!fileValidation.valid) {
        return NextResponse.json(
          { error: fileValidation.error },
          { status: 400 }
        );
      }

      // Generate file path using user ID and optional blog ID
      const pathPrefix = blogId ? `${user.id}/${blogId}` : user.id;
      const filePath = generateFilePath(pathPrefix, file.name, 'thumbnails');

      // Upload file to Supabase storage
      const uploadResult = await uploadFile({
        bucket: STORAGE_BUCKETS.BLOG_THUMBNAILS,
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
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

    } catch (error) {
      console.error('Error uploading blog thumbnail:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }
  });
}