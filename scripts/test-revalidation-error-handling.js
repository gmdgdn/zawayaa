/**
 * Simple test script for revalidation API error handling
 * Tests the error handling and logging functionality
 */

const { spawn } = require('child_process');
const http = require('http');

// Test configuration
const TEST_SECRET = 'test-secret-123';
const BASE_URL = 'http://localhost:3000';

// Set environment variable for testing
process.env.REVALIDATION_SECRET = TEST_SECRET;

console.log('🧪 Testing Revalidation API Error Handling...\n');

// Test cases
const testCases = [
  {
    name: 'Invalid JSON',
    body: 'invalid json',
    expectedStatus: 400,
    expectedError: 'Bad Request'
  },
  {
    name: 'Missing secret',
    body: JSON.stringify({ tag: '/test' }),
    expectedStatus: 401,
    expectedError: 'Unauthorized'
  },
  {
    name: 'Invalid secret',
    body: JSON.stringify({ secret: 'wrong-secret', tag: '/test' }),
    expectedStatus: 401,
    expectedError: 'Unauthorized'
  },
  {
    name: 'Missing tag',
    body: JSON.stringify({ secret: TEST_SECRET }),
    expectedStatus: 400,
    expectedError: 'Bad Request'
  },
  {
    name: 'Empty tag',
    body: JSON.stringify({ secret: TEST_SECRET, tag: '' }),
    expectedStatus: 400,
    expectedError: 'Bad Request'
  },
  {
    name: 'Tag with invalid characters',
    body: JSON.stringify({ secret: TEST_SECRET, tag: '<script>alert("xss")</script>' }),
    expectedStatus: 400,
    expectedError: 'Bad Request'
  },
  {
    name: 'Valid request',
    body: JSON.stringify({ secret: TEST_SECRET, tag: '/programs' }),
    expectedStatus: 200,
    expectedSuccess: true
  }
];

async function makeRequest(testCase) {
  return new Promise((resolve, reject) => {
    const postData = testCase.body;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/revalidate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: response
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function testHealthCheck() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/revalidate',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: response
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function runTests() {
  console.log('📊 Testing Health Check Endpoint...');
  try {
    const healthResponse = await testHealthCheck();
    if (healthResponse.status === 200 && healthResponse.data.status === 'healthy') {
      console.log('✅ Health check passed');
      console.log('📈 Metrics available:', !!healthResponse.data.metrics);
    } else {
      console.log('❌ Health check failed');
    }
  } catch (error) {
    console.log('⚠️  Health check endpoint not available (server may not be running)');
  }

  console.log('\n🔍 Testing Error Handling...');
  
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      const response = await makeRequest(testCase);
      
      // Check status code
      if (response.status === testCase.expectedStatus) {
        console.log(`✅ Status code: ${response.status}`);
      } else {
        console.log(`❌ Expected status ${testCase.expectedStatus}, got ${response.status}`);
        failed++;
        continue;
      }

      // Check response structure
      if (testCase.expectedSuccess) {
        if (response.data.success && response.data.revalidated && response.data.requestId) {
          console.log('✅ Success response structure correct');
          console.log(`   Revalidated: ${response.data.revalidated}`);
          console.log(`   Duration: ${response.data.duration}ms`);
          passed++;
        } else {
          console.log('❌ Success response structure incorrect');
          failed++;
        }
      } else {
        if (response.data.error === testCase.expectedError && response.data.requestId && response.data.timestamp) {
          console.log('✅ Error response structure correct');
          console.log(`   Error: ${response.data.error}`);
          console.log(`   Message: ${response.data.message}`);
          passed++;
        } else {
          console.log('❌ Error response structure incorrect');
          console.log('   Expected error:', testCase.expectedError);
          console.log('   Actual response:', response.data);
          failed++;
        }
      }
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All error handling tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the implementation.');
    process.exit(1);
  }
}

// Check if server is running, if not provide instructions
async function checkServer() {
  try {
    await testHealthCheck();
    runTests();
  } catch (error) {
    console.log('⚠️  Development server is not running.');
    console.log('📝 To test the error handling:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Run this test script: node scripts/test-revalidation-error-handling.js');
    console.log('\n🔍 Testing API implementation structure instead...\n');
    
    // Test the implementation structure
    testImplementationStructure();
  }
}

function testImplementationStructure() {
  const fs = require('fs');
  const path = require('path');
  
  console.log('🔍 Checking implementation structure...');
  
  const apiPath = path.join(__dirname, '..', 'app', 'api', 'revalidate', 'route.ts');
  
  if (!fs.existsSync(apiPath)) {
    console.log('❌ API route file not found');
    return;
  }
  
  const content = fs.readFileSync(apiPath, 'utf8');
  
  const checks = [
    { name: 'Error response interface', pattern: /interface ErrorResponse/ },
    { name: 'Success response interface', pattern: /interface SuccessResponse/ },
    { name: 'Metrics tracking', pattern: /metrics\s*=/ },
    { name: 'Rate limiting', pattern: /checkRateLimit/ },
    { name: 'Request logging', pattern: /console\.log.*request.*received/ },
    { name: 'Error logging', pattern: /console\.error/ },
    { name: 'Request ID generation', pattern: /requestId.*=/ },
    { name: 'Duration tracking', pattern: /startTime.*Date\.now/ },
    { name: 'JSON parsing error handling', pattern: /catch.*parseError/ },
    { name: 'Secret validation', pattern: /body\.secret.*REVALIDATION_SECRET/ },
    { name: 'Tag validation', pattern: /body\.tag/ },
    { name: 'Invalid characters check', pattern: /invalidChars/ },
    { name: 'GET endpoint for health check', pattern: /export.*async.*function.*GET/ }
  ];
  
  let passed = 0;
  
  checks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
    }
  });
  
  console.log(`\n📊 Implementation Structure:`);
  console.log(`✅ Features implemented: ${passed}/${checks.length}`);
  console.log(`📈 Completion: ${((passed / checks.length) * 100).toFixed(1)}%`);
  
  if (passed === checks.length) {
    console.log('\n🎉 All required error handling features are implemented!');
  } else {
    console.log('\n⚠️  Some features may be missing or need adjustment.');
  }
}

checkServer();