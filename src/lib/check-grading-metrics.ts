import { db } from './db';
import { gradingMetrics } from './schema';

async function checkGradingMetrics() {
  console.log('🔍 Checking grading metrics in database...');

  try {
    const metrics = await db.select().from(gradingMetrics);
    
    console.log(`\n📊 Found ${metrics.length} grading metrics in database:`);
    console.log('=' .repeat(80));
    
    metrics.forEach((metric, index) => {
      console.log(`${index + 1}. ${metric.name}`);
      console.log(`   Description: ${metric.description}`);
      console.log(`   Max Score: ${metric.maxScore}`);
      console.log(`   Weight: ${metric.weight}`);
      console.log(`   Active: ${metric.isActive ? 'Yes' : 'No'}`);
      console.log(`   Created: ${metric.createdAt}`);
      console.log('-'.repeat(80));
    });

    console.log(`\n✅ Total grading metrics: ${metrics.length}`);
    console.log(`📈 Total possible score: ${metrics.reduce((sum, metric) => sum + metric.maxScore, 0)} points`);
    
  } catch (error) {
    console.error('❌ Error checking grading metrics:', error);
    throw error;
  }
}

// Run the check function
checkGradingMetrics()
  .then(() => {
    console.log('🎉 Grading metrics check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Grading metrics check failed:', error);
    process.exit(1);
  });