import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getTechStackById, updateTechStack, deleteTechStack } from '@/lib/techstacks';

const updateTechStackSchema = z.object({
  name: z.string().min(1, 'Tech stack name is required').max(100, 'Tech stack name must be less than 100 characters').optional(),
  iconUrl: z.string().url().optional().nullable(),
  bgHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Background color must be a valid hex color').optional(),
  borderHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Border color must be a valid hex color').optional(),
  textHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Text color must be a valid hex color').optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const techstack = await getTechStackById(params.id);
    
    if (!techstack) {
      return NextResponse.json(
        { error: 'Tech stack not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(techstack);
  } catch (error: any) {
    console.error('Error fetching tech stack:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech stack' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateTechStackSchema.parse(body);
    
    const techstack = await updateTechStack(params.id, validatedData);
    
    if (!techstack) {
      return NextResponse.json(
        { error: 'Tech stack not found or failed to update' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(techstack);
  } catch (error: any) {
    console.error('Error updating tech stack:', error);
    
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
      { error: 'Failed to update tech stack' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteTechStack(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Tech stack not found or failed to delete' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Tech stack deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting tech stack:', error);
    return NextResponse.json(
      { error: 'Failed to delete tech stack' },
      { status: 500 }
    );
  }
}