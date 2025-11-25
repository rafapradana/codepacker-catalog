import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local manually since dotenv doesn't do it by default
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function main() {
    try {
        // Dynamic import to ensure env vars are loaded first
        const { generateProjectIdeas } = await import('../src/lib/openrouter');

        console.log('Testing generateProjectIdeas with OpenRouter...');
        const ideas = await generateProjectIdeas({
            skillLevel: 'beginner',
            techStack: ['React', 'Tailwind'],
            timeAvailable: '20 hours',
            category: 'web-app',
            difficulty: 'easy'
        });
        console.log('Success!');
        fs.writeFileSync('ai-response.json', JSON.stringify(JSON.parse(ideas), null, 2));
        console.log('Response written to ai-response.json');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

main();
