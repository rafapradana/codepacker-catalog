import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getTechStacks, createTechStack } from '@/lib/techstacks';

const createTechStackSchema = z.object({
  name: z.string().min(1, 'Tech stack name is required').max(100, 'Tech stack name must be less than 100 characters'),
  iconUrl: z.string().url().optional().nullable(),
  bgHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Background color must be a valid hex color'),
  borderHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Border color must be a valid hex color'),
  textHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Text color must be a valid hex color'),
});

export async function GET() {
  try {
    const techstacks = await getTechStacks();
    return NextResponse.json(techstacks);
  } catch (error: any) {
    console.error('Error fetching tech stacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech stacks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createTechStackSchema.parse(body);
    
    const techstack = await createTechStack(validatedData);
    
    if (!techstack) {
      return NextResponse.json(
        { error: 'Failed to create tech stack' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(techstack, { status: 201 });
  } catch (error: any) {
    console.error('Error creating tech stack:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create tech stack' },
      { status: 500 }
    );
  }
}