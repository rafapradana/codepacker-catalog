import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for public operations (frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (storage management)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  PROFILE_PHOTOS: 'profile-photos',
  SKILL_ICONS: 'skill-icons',
  TECHSTACK_ICONS: 'techstack-icons',
  PROJECT_THUMBNAILS: 'project-thumbnails',
  PROJECT_MEDIA: 'project-media',
} as const;

// File upload utilities
export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  upsert?: boolean;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

/**
 * Upload file to Supabase storage
 */
export async function uploadFile({ bucket, path, file, upsert = false }: UploadOptions): Promise<UploadResult> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        upsert,
        cacheControl: '3600'
      });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    const url = getPublicUrl(bucket, data.path);
    
    return {
      success: true,
      url,
      path: data.path
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate unique file path with user ID and timestamp
 */
export function generateFilePath(userId: string, originalFileName: string, folder?: string): string {
  const timestamp = Date.now();
  const extension = originalFileName.split('.').pop();
  const baseName = originalFileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-');
  
  const fileName = `${baseName}-${timestamp}.${extension}`;
  
  if (folder) {
    return `${userId}/${folder}/${fileName}`;
  }
  
  return `${userId}/${fileName}`;
}

/**
 * Validate file type and size
 */
export interface FileValidationOptions {
  allowedTypes: string[];
  maxSize: number; // in bytes
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File, options: FileValidationOptions): FileValidationResult {
  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
    };
  }

  // Check file size
  if (file.size > options.maxSize) {
    const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(1);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size ${fileSizeMB}MB exceeds maximum allowed size of ${maxSizeMB}MB`
    };
  }

  return { valid: true };
}

// Predefined validation options for different file types
export const FILE_VALIDATION_OPTIONS: Record<string, FileValidationOptions> = {
  PROFILE_PHOTO: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  ICON: {
    allowedTypes: ['image/svg+xml', 'image/png', 'image/jpeg'],
    maxSize: 1 * 1024 * 1024 // 1MB
  },
  PROJECT_THUMBNAIL: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  PROJECT_MEDIA: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'],
    maxSize: 50 * 1024 * 1024 // 50MB
  }
} as const;