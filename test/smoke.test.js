import http from 'http';

// Simple smoke test for the API
async function testHealthEndpoint() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5137,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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
          
          if (res.statusCode === 200 && response.status === 'ok') {
            console.log('✅ Health endpoint test passed');
            resolve(true);
          } else {
            console.log('❌ Health endpoint test failed - unexpected response:', response);
            reject(new Error('Unexpected response'));
          }
        } catch (error) {
          console.log('❌ Health endpoint test failed - invalid JSON:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Health endpoint test failed - request error:', error.message);
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Run the smoke test
async function runSmokeTests() {
  console.log('🧪 Running backend smoke tests...');
  
  try {
    await testHealthEndpoint();
    console.log('🎉 All smoke tests passed!');
    process.exit(0);
  } catch (error) {
    console.log('💥 Smoke tests failed:', error.message);
    process.exit(1);
  }
}

// Always run the tests when this file is executed
runSmokeTests();

export { testHealthEndpoint, runSmokeTests };
