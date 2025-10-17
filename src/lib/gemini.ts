import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI client
export const geminiAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

// Gemini model configurations
export const GEMINI_MODELS = {
  FLASH: 'gemini-2.0-flash-exp',
  FLASH_LITE: 'gemini-2.5-flash-lite'
} as const;

// Default generation config for project ideas
export const PROJECT_IDEAS_CONFIG = {
  temperature: 0.8, // Creative but controlled
  maxOutputTokens: 2000,
  topP: 0.9,
  topK: 40
};

// Prompt templates
export const PROMPT_TEMPLATES = {
  PROJECT_IDEAS: (params: {
    skillLevel: string;
    techStack: string[];
    timeAvailable: string;
    category: string;
    difficulty: string;
  }) => `
Sebagai AI assistant untuk platform pembelajaran coding, buatkan 3 ide proyek yang menarik dan relevan dengan kriteria berikut:

**Profil Siswa:**
- Skill Level: ${params.skillLevel}
- Tech Stack yang ingin digunakan: ${params.techStack.join(', ')}
- Waktu tersedia: ${params.timeAvailable}
- Kategori proyek: ${params.category}
- Tingkat kesulitan: ${params.difficulty}

**Instruksi:**
1. Buatkan 3 ide proyek yang unik dan menarik
2. Setiap proyek harus sesuai dengan skill level dan tech stack yang diminta
3. Estimasi waktu pengerjaan harus realistis sesuai dengan waktu yang tersedia
4. Berikan deskripsi yang jelas dan menginspirasi
5. Sertakan fitur-fitur utama yang akan dibangun
6. Pastikan proyek dapat dikerjakan oleh siswa dengan skill level ${params.skillLevel}

**Format Response (JSON):**
{
  "ideas": [
    {
      "title": "Nama Proyek",
      "description": "Deskripsi lengkap proyek (2-3 kalimat yang menjelaskan tujuan dan manfaat proyek)",
      "techStack": ["React", "Node.js", "PostgreSQL"],
      "difficulty": "${params.difficulty}",
      "estimatedHours": 40,
      "category": "${params.category}",
      "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
    }
  ]
}

**Catatan Penting:**
- Pastikan response HANYA berupa JSON yang valid
- Jangan tambahkan teks apapun di luar JSON
- Estimasi jam harus realistis (beginner: 20-40 jam, intermediate: 40-80 jam, advanced: 80-120 jam)
- Fitur harus spesifik dan dapat diimplementasikan
`
};

// Helper function to generate project ideas
export async function generateProjectIdeas(params: {
  skillLevel: string;
  techStack: string[];
  timeAvailable: string;
  category: string;
  difficulty: string;
}) {
  try {
    const prompt = PROMPT_TEMPLATES.PROJECT_IDEAS(params);
    
    const response = await geminiAI.models.generateContent({
      model: GEMINI_MODELS.FLASH,
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error('Error generating project ideas with Gemini:', error);
    throw error;
  }
}

// Helper function to parse AI response
export function parseAIResponse(aiResponse: string) {
  try {
    // Remove any markdown code blocks or extra formatting
    let cleanResponse = aiResponse.trim();
    
    // Remove ```json and ``` if present
    cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
    
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Failed to parse AI response:', aiResponse);
    throw new Error('Failed to parse AI response');
  }
}

// Validation function for project idea structure
export function validateProjectIdea(idea: any): boolean {
  return (
    typeof idea.title === 'string' &&
    typeof idea.description === 'string' &&
    Array.isArray(idea.techStack) &&
    typeof idea.difficulty === 'string' &&
    typeof idea.estimatedHours === 'number' &&
    typeof idea.category === 'string' &&
    Array.isArray(idea.features)
  );
}