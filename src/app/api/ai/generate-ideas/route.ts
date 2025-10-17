import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiProjectIdeas, students } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { generateProjectIdeas, parseAIResponse, validateProjectIdea } from '@/lib/gemini';

interface GenerateIdeasRequest {
  studentId: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  techStack: string[];
  timeAvailable: string;
  category: 'web-app' | 'mobile' | 'game' | 'ai-ml' | 'desktop' | 'api';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ProjectIdea {
  title: string;
  description: string;
  techStack: string[];
  difficulty: string;
  estimatedHours: number;
  category: string;
  features: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateIdeasRequest = await request.json();
    const { studentId, skillLevel, techStack, timeAvailable, category, difficulty } = body;

    // Validate required fields
    if (!studentId || !skillLevel || !techStack || !timeAvailable || !category || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure techStack is an array
    const techStackArray = Array.isArray(techStack) ? techStack : [techStack];
    if (techStackArray.length === 0) {
      return NextResponse.json(
        { error: 'Tech stack cannot be empty' },
        { status: 400 }
      );
    }

    // Verify student exists
    const student = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
    if (student.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create AI prompt and generate ideas
    const aiResponse = await generateProjectIdeas({
      skillLevel,
      techStack: techStackArray,
      timeAvailable,
      category,
      difficulty
    });

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'Failed to generate AI response' },
        { status: 500 }
      );
    }

    // Parse AI response
    const parsedResponse = parseAIResponse(aiResponse);

    // Validate and save ideas to database
    const savedIdeas = [];
    
    if (parsedResponse.ideas && Array.isArray(parsedResponse.ideas)) {
      for (const idea of parsedResponse.ideas) {
        // Validate idea structure
        if (!validateProjectIdea(idea)) {
          console.warn('Invalid project idea structure:', idea);
          continue;
        }

        // Save to database
        const savedIdea = await db.insert(aiProjectIdeas).values({
          id: crypto.randomUUID(),
          studentId: studentId,
          title: idea.title,
          description: idea.description,
          techStack: JSON.stringify(idea.techStack),
          difficulty: idea.difficulty,
          estimatedHours: idea.estimatedHours,
          category: idea.category,
          features: JSON.stringify(idea.features),
          isBookmarked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning()

        savedIdeas.push({
          ...savedIdea[0],
          techStack: JSON.parse(savedIdea[0].techStack || '[]'),
          features: JSON.parse(savedIdea[0].features || '[]'),
        })
      }
    }

    return NextResponse.json({
      success: true,
      ideas: savedIdeas,
      message: `Successfully generated ${savedIdeas.length} project ideas`
    });

  } catch (error) {
    console.error('Error generating project ideas:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate project ideas',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve saved ideas for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Get saved ideas for the student
    const ideas = await db
      .select()
      .from(aiProjectIdeas)
      .where(eq(aiProjectIdeas.studentId, studentId))
      .orderBy(aiProjectIdeas.createdAt);

    // Parse JSON fields
    const formattedIdeas = ideas.map(idea => ({
      ...idea,
      techStack: JSON.parse(idea.techStack || '[]'),
      features: JSON.parse(idea.features || '[]')
    }));

    return NextResponse.json({
      success: true,
      ideas: formattedIdeas
    });

  } catch (error) {
    console.error('Error fetching project ideas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}