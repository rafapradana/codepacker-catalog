import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  uploadFile, 
  generateFilePath, 
  validateFile, 
  FILE_VALIDATION_OPTIONS,
  STORAGE_BUCKETS 
} from '@/lib/storage';
import { db } from '@/lib/db';
import { blogMedia, blogs } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { withStudentAuth } from '@/lib/middleware';

// Zod schema for upload request
const uploadSchema = z.object({
  blogId: z.string().uuid('Blog ID must be a valid UUID'),
  alt: z.string().max(255, 'Alt text must be less than 255 characters').optional(),
  caption: z.string().max(500, 'Caption must be less than 500 characters').optional(),
  order: z.number().int().min(0, 'Order must be a non-negative integer').optional().default(0),
});

export async function POST(request: NextRequest) {
  return withStudentAuth(request, async (request, { user }) => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const blogId = formData.get('blogId') as string;
      const alt = formData.get('alt') as string;
      const caption = formData.get('caption') as string;
      const order = formData.get('order') as string;

      // Validate required fields
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      if (!blogId) {
        return NextResponse.json(
          { error: 'Blog ID is required' },
          { status: 400 }
        );
      }

      // Validate request data
      const validationData = {
        blogId,
        alt: alt || undefined,
        caption: caption || undefined,
        order: order ? parseInt(order) : 0,
      };

      const dataValidation = uploadSchema.safeParse(validationData);
      if (!dataValidation.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: dataValidation.error.issues },
          { status: 400 }
        );
      }

      // Verify blog exists and belongs to the authenticated user
      const [blog] = await db
        .select({ 
          id: blogs.id, 
          studentId: blogs.studentId 
        })
        .from(blogs)
        .where(eq(blogs.id, blogId))
        .limit(1);

      if (!blog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }

      if (blog.studentId !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized to upload media to this blog' },
          { status: 403 }
        );
      }

      // Validate file
      const fileValidation = validateFile(file, FILE_VALIDATION_OPTIONS.BLOG_MEDIA);
      if (!fileValidation.valid) {
        return NextResponse.json(
          { error: fileValidation.error },
          { status: 400 }
        );
      }

      // Generate file path
      const filePath = generateFilePath(`${user.id}/${blogId}`, file.name, 'media');

      // Upload file to Supabase storage
      const uploadResult = await uploadFile({
        bucket: STORAGE_BUCKETS.BLOG_MEDIA,
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

      // Save media record to database
      const [newBlogMedia] = await db
        .insert(blogMedia)
        .values({
          blogId,
          fileName: file.name,
          fileUrl: uploadResult.url!,
          fileType: file.type,
          fileSize: file.size,
          alt: validationData.alt,
          caption: validationData.caption,
          order: validationData.order,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return NextResponse.json({
        success: true,
        media: newBlogMedia,
        url: uploadResult.url,
        path: uploadResult.path
      });

    } catch (error) {
      console.error('Error uploading blog media:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }
  });
}