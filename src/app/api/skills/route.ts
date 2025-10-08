import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSkills, createSkill } from '@/lib/skills';

const createSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100, 'Skill name must be less than 100 characters'),
  iconUrl: z.string().url().optional().nullable(),
  bgHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Background color must be a valid hex color'),
  borderHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Border color must be a valid hex color'),
  textHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Text color must be a valid hex color'),
});

export async function GET() {
  try {
    const skills = await getSkills();
    return NextResponse.json(skills);
  } catch (error: any) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createSkillSchema.parse(body);
    
    const skill = await createSkill(validatedData);
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Failed to create skill' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    console.error('Error creating skill:', error);
    
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
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}