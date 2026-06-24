import http from 'http';

async function testRegisterEndpoint() {
  console.log('\n🧪 Testing Registration Endpoint\n');
  console.log('URL: http://localhost:4000/api/auth/register');
  console.log('Method: POST\n');

  const testData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User'
  };

  console.log('Request Body:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n-------------------------------------------\n');

  return new Promise((resolve) => {
    const postData = JSON.stringify(testData);

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/auth/register',
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
        console.log(`Status Code: ${res.statusCode}\n`);
        console.log('Response Headers:');
        console.log(JSON.stringify(res.headers, null, 2));
        console.log('\nResponse Body:');
        try {
          console.log(JSON.stringify(JSON.parse(data), null, 2));
        } catch (e) {
          console.log(data);
        }
        console.log('\n-------------------------------------------\n');
        
        if (res.statusCode === 201) {
          console.log('✅ Registration endpoint is working!\n');
        } else if (res.statusCode === 409) {
          console.log('⚠️  User already exists (this is expected if you already registered)\n');
        } else {
          console.log('❌ Unexpected status code\n');
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ Connection Error:', error.message);
      console.log('\nMake sure the backend server is running:');
      console.log('  Terminal: npm run backend\n');
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function testLoginEndpoint() {
  console.log('🧪 Testing Login Endpoint\n');
  console.log('URL: http://localhost:4000/api/auth/login');
  console.log('Method: POST\n');

  const testData = {
    email: 'test@example.com',
    password: 'password123'
  };

  console.log('Request Body:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n-------------------------------------------\n');

  return new Promise((resolve) => {
    const postData = JSON.stringify(testData);

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/auth/login',
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
        console.log(`Status Code: ${res.statusCode}\n`);
        console.log('Response Body:');
        try {
          console.log(JSON.stringify(JSON.parse(data), null, 2));
        } catch (e) {
          console.log(data);
        }
        console.log('\n-------------------------------------------\n');
        
        if (res.statusCode === 200) {
          console.log('✅ Login endpoint is working!\n');
        } else if (res.statusCode === 401) {
          console.log('❌ Invalid credentials\n');
        } else {
          console.log('❌ Unexpected status code\n');
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ Connection Error:', error.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  await testRegisterEndpoint();
  await testLoginEndpoint();
}

runTests();
