import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSkillById, updateSkill, deleteSkill } from '@/lib/skills';

const updateSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100, 'Skill name must be less than 100 characters').optional(),
  iconUrl: z.string().url().optional().nullable(),
  bgHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Background color must be a valid hex color').optional(),
  borderHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Border color must be a valid hex color').optional(),
  textHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Text color must be a valid hex color').optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const skill = await getSkillById(id);
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(skill);
  } catch (error: any) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateSkillSchema.parse(body);
    
    const skill = await updateSkill(id, validatedData);
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found or failed to update' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(skill);
  } catch (error: any) {
    console.error('Error updating skill:', error);
    
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
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteSkill(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Skill not found or failed to delete' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}