// Simple test script to debug your backend API
const axios = require('axios');

async function testBackendAPI() {
  const baseURL = 'http://localhost:5001';
  
  console.log('🔍 Testing Backend API...\n');
  
  try {
    // Test 1: Check if backend is running
    console.log('1. Testing backend root endpoint...');
    const rootResponse = await axios.get(baseURL);
    console.log(`✅ Backend is running (Status: ${rootResponse.status})`);
    console.log(`Response: ${JSON.stringify(rootResponse.data).substring(0, 100)}...\n`);
    
  } catch (error) {
    console.log(`❌ Backend not accessible: ${error.message}\n`);
    return;
  }
  
  try {
    // Test 2: Check countries endpoint
    console.log('2. Testing countries endpoint...');
    const countriesResponse = await axios.get(`${baseURL}/locations/countries`);
    console.log(`✅ Countries API working (Status: ${countriesResponse.status})`);
    console.log(`Countries count: ${countriesResponse.data.length || 'Unknown'}`);
    console.log(`First country: ${JSON.stringify(countriesResponse.data[0]).substring(0, 100)}...\n`);
    
  } catch (error) {
    console.log(`❌ Countries API error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${JSON.stringify(error.response.data)}`);
    }
    console.log('');
  }
  
  try {
    // Test 3: Check other endpoints
    console.log('3. Testing other endpoints...');
    const endpoints = ['/locations/states', '/locations/cities'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${baseURL}${endpoint}`);
        console.log(`✅ ${endpoint} working (Status: ${response.status})`);
      } catch (error) {
        console.log(`❌ ${endpoint} error: ${error.response?.status || error.message}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Other endpoints error: ${error.message}\n`);
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Check your backend console for error logs');
  console.log('2. Verify database connection is working');
  console.log('3. Check if countries table exists and has data');
  console.log('4. Ensure all environment variables are set');
}

// Run the test
testBackendAPI().catch(console.error);
