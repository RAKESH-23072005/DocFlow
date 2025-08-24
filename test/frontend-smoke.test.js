import http from 'http';

// Simple frontend smoke test
async function testHomepageLoads() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5137,
      path: '/',
      method: 'GET',
      headers: {
        'Accept': 'text/html'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Check if response is HTML
          if (res.statusCode === 200 && data.includes('<!DOCTYPE html>')) {
            console.log('✅ Homepage loads successfully');
            
            // Check for key elements
            const hasTitle = data.includes('<title>') || data.includes('ImageCompressor');
            const hasMainContent = data.includes('main') || data.includes('id="root"') || data.includes('class="app"');
            
            if (hasTitle && hasMainContent) {
              console.log('✅ Homepage contains expected elements');
              resolve(true);
            } else {
              console.log('❌ Homepage missing expected elements');
              reject(new Error('Missing expected elements'));
            }
          } else {
            console.log('❌ Homepage test failed - unexpected response:', res.statusCode);
            reject(new Error('Unexpected response'));
          }
        } catch (error) {
          console.log('❌ Homepage test failed - error:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Homepage test failed - request error:', error.message);
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Run the frontend smoke test
async function runFrontendSmokeTests() {
  console.log('🧪 Running frontend smoke tests...');
  
  try {
    await testHomepageLoads();
    console.log('🎉 All frontend smoke tests passed!');
    process.exit(0);
  } catch (error) {
    console.log('💥 Frontend smoke tests failed:', error.message);
    process.exit(1);
  }
}

// Always run the tests when this file is executed
runFrontendSmokeTests();

export { testHomepageLoads, runFrontendSmokeTests };
