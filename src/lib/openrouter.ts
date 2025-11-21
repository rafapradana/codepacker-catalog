import OpenAI from 'openai';

// Initialize OpenAI client with OpenRouter configuration
export const openRouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://codepacker.jh-beon.cloud', // Optional, for including your app on openrouter.ai rankings.
        'X-Title': 'CodePacker', // Optional. Shows in rankings on openrouter.ai.
    },
});

export const OPENROUTER_MODELS = {
    GROK_FAST_FREE: 'x-ai/grok-4.1-fast:free',
} as const;

// Prompt templates (reusing the structure from gemini.ts but adapted if needed)
export const PROMPT_TEMPLATES = {
    PROJECT_IDEAS: (params: {
        skillLevel: string;
        techStack: string[];
        timeAvailable: string;
        category: string;
        difficulty: string;
    }) => `
Sebagai AI assistant untuk platform pembelajaran coding, tugasmu adalah membuatkan TEPAT 3 (TIGA) ide proyek yang menarik dan relevan.

**Profil Siswa:**
- Skill Level: ${params.skillLevel}
- Tech Stack yang ingin digunakan: ${params.techStack.join(', ')}
- Waktu tersedia: ${params.timeAvailable}
- Kategori proyek: ${params.category}
- Tingkat kesulitan: ${params.difficulty}

**Instruksi UTAMA:**
1. WAJIB membuatkan 3 ide proyek. Tidak boleh kurang, tidak boleh lebih.
2. Setiap proyek harus unik dan berbeda satu sama lain.
3. Setiap proyek harus sesuai dengan skill level dan tech stack yang diminta.
4. Estimasi waktu pengerjaan harus realistis sesuai dengan waktu yang tersedia.

**Format Response (JSON):**
Response HARUS berupa JSON valid dengan struktur persis seperti ini:
{
  "ideas": [
    {
      "title": "Nama Proyek 1",
      "description": "Deskripsi lengkap proyek 1...",
      "techStack": ["Tech 1", "Tech 2"],
      "difficulty": "${params.difficulty}",
      "estimatedHours": 40,
      "category": "${params.category}",
      "features": ["Feature 1", "Feature 2"]
    },
    {
      "title": "Nama Proyek 2",
      "description": "Deskripsi lengkap proyek 2...",
      "techStack": ["Tech 1", "Tech 2"],
      "difficulty": "${params.difficulty}",
      "estimatedHours": 40,
      "category": "${params.category}",
      "features": ["Feature 1", "Feature 2"]
    },
    {
      "title": "Nama Proyek 3",
      "description": "Deskripsi lengkap proyek 3...",
      "techStack": ["Tech 1", "Tech 2"],
      "difficulty": "${params.difficulty}",
      "estimatedHours": 40,
      "category": "${params.category}",
      "features": ["Feature 1", "Feature 2"]
    }
  ]
}

**Catatan Penting:**
- Pastikan array "ideas" berisi TEPAT 3 objek.
- Pastikan response HANYA berupa JSON yang valid.
- Jangan tambahkan teks apapun di luar JSON.
`
};

export async function generateProjectIdeas(params: {
    skillLevel: string;
    techStack: string[];
    timeAvailable: string;
    category: string;
    difficulty: string;
}) {
    try {
        const prompt = PROMPT_TEMPLATES.PROJECT_IDEAS(params);

        const completion = await openRouter.chat.completions.create({
            model: OPENROUTER_MODELS.GROK_FAST_FREE,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            response_format: { type: 'json_object' }, // Force JSON mode if supported, otherwise prompt handles it
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content received from OpenRouter');
        }

        return content;
    } catch (error) {
        console.error('Error generating project ideas with OpenRouter:', error);
        throw error;
    }
}

// Helper function to parse AI response (similar to gemini.ts but adapted for OpenAI response)
export function parseAIResponse(aiResponse: string) {
    try {
        // Remove any markdown code blocks or extra formatting if still present
        let cleanResponse = aiResponse.trim();
        cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');

        return JSON.parse(cleanResponse);
    } catch (error) {
        console.error('Failed to parse AI response:', aiResponse);
        throw new Error('Failed to parse AI response');
    }
}

// Validation function (reused)
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
