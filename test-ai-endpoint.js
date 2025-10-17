// Test script for AI Project Ideas Generator endpoint
const testEndpoint = async () => {
  const baseUrl = 'http://localhost:3000';
  
  // Test data
  const testData = {
    studentId: '1', // Make sure this student exists in your database
    skillLevel: 'intermediate',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    timeAvailable: '2-3 bulan',
    category: 'web-app',
    difficulty: 'medium'
  };

  console.log('🚀 Testing AI Project Ideas Generator...\n');
  console.log('Test Data:', JSON.stringify(testData, null, 2));
  console.log('\n' + '='.repeat(50) + '\n');

  try {
    // Test POST endpoint - Generate new ideas
    console.log('📝 Testing POST /api/ai/generate-ideas...');
    
    const response = await fetch(`${baseUrl}/api/ai/generate-ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ POST Request Successful!');
      console.log('Response:', JSON.stringify(result, null, 2));
      
      // Test GET endpoint - Retrieve saved ideas
      console.log('\n📖 Testing GET /api/ai/generate-ideas...');
      
      const getResponse = await fetch(`${baseUrl}/api/ai/generate-ideas?studentId=${testData.studentId}`);
      const getResult = await getResponse.json();
      
      if (getResponse.ok) {
        console.log('✅ GET Request Successful!');
        console.log('Saved Ideas Count:', getResult.ideas?.length || 0);
        console.log('Sample Idea:', getResult.ideas?.[0] || 'No ideas found');
      } else {
        console.log('❌ GET Request Failed:', getResult);
      }
      
    } else {
      console.log('❌ POST Request Failed:', result);
    }

  } catch (error) {
    console.error('🔥 Test Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Server is running on http://localhost:3000');
    console.log('2. Database is connected and migrated');
    console.log('3. GEMINI_API_KEY is set in .env file');
    console.log('4. Student with ID 1 exists in database');
  }
};

// Run the test
testEndpoint();