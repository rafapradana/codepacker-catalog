import { db } from './db';
import { gradingMetrics } from './schema';

async function seedGradingMetrics() {
  console.log('📊 Starting grading metrics seeding...');

  try {
    // Create grading metrics
    console.log('📊 Creating grading metrics...');
    const gradingMetricsData = await db.insert(gradingMetrics).values([
      {
        name: 'Technical Implementation',
        description: 'Kualitas kode (clean code, struktur, naming convention), penggunaan teknologi yang tepat, kompleksitas teknis yang diterapkan',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'User Interface/User Experience',
        description: 'Desain visual yang menarik, kemudahan penggunaan (usability), responsiveness di berbagai device',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Functionality',
        description: 'Kelengkapan fitur sesuai requirement, fitur berjalan dengan baik tanpa bug, edge case handling',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Code Quality',
        description: 'Struktur folder dan file yang rapi, dokumentasi kode (comments, README), best practices programming',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Innovation & Creativity',
        description: 'Keunikan ide atau pendekatan, problem solving yang kreatif, value proposition yang jelas',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Performance',
        description: 'Loading speed, optimasi resource, scalability consideration',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Security',
        description: 'Input validation, authentication/authorization (jika ada), data protection',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Documentation',
        description: 'README yang lengkap, setup instructions yang jelas, API documentation (jika ada)',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Deployment & Accessibility',
        description: 'Project bisa diakses online, setup deployment yang proper, URL yang working',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      },
      {
        name: 'Presentation & Communication',
        description: 'Kemampuan explain project, demo yang smooth, storytelling yang baik',
        maxScore: 10,
        weight: '1.00',
        isActive: true
      }
    ]).returning();

    console.log('✅ Grading metrics seeding completed successfully!');
    console.log('📊 Created:');
    console.log(`   - ${gradingMetricsData.length} grading metrics`);
    
    console.log('\n📋 Grading Metrics Created:');
    gradingMetricsData.forEach((metric, index) => {
      console.log(`   ${index + 1}. ${metric.name} (Max Score: ${metric.maxScore})`);
    });

  } catch (error) {
    console.error('❌ Error seeding grading metrics:', error);
    throw error;
  }
}

// Run the seed function
seedGradingMetrics()
  .then(() => {
    console.log('🎉 Grading metrics seeding process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Grading metrics seeding process failed:', error);
    process.exit(1);
  });