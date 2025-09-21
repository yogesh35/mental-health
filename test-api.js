const http = require('http');

// Test the news API endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/external/news?limit=2',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Success:', response.success);
      console.log('Articles Count:', response.data ? response.data.length : 0);
      if (response.data && response.data.length > 0) {
        console.log('Sample Title:', response.data[0].title);
      }
      console.log('Full Response:', JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();