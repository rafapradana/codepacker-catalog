import { db } from '@/lib/db';
import { projects, students, categories, projectTechstacks, projectMedia, techstacks } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export interface Project {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  githubUrl: string;
  liveDemoUrl?: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithDetails extends Project {
  student: {
    id: string;
    fullName: string;
    profilePhotoUrl: string | null;
    classId: string | null;
    className: string | null;
  } | null;
  category: {
    id: string;
    name: string;
    bgHex: string | null;
    borderHex: string | null;
    textHex: string | null;
  } | null;
  techstacks: {
    id: string;
    techstack: {
      id: string;
      name: string | null;
      iconUrl: string | null;
      bgHex: string | null;
      borderHex: string | null;
      textHex: string | null;
    } | null;
  }[];
  media: {
    id: string;
    mediaUrl: string;
    mediaType: string;
    createdAt: Date;
  }[];
}

export interface CreateProjectData {
  studentId: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  githubUrl: string;
  liveDemoUrl?: string | null;
  categoryId?: string | null;
}

export interface UpdateProjectData {
  title?: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  githubUrl?: string;
  liveDemoUrl?: string | null;
  categoryId?: string | null;
}