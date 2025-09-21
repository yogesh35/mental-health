const axios = require('axios');

// Test Descope configuration
const projectId = 'P32zcEyGkBV2Md2TX0fvX4JiOEaQ';
const managementKey = 'K32zclerqrej2jqF6w6i9hcmQFmC4n9646lzbn0hP389DbFOSBAxQS8lySkDnZZKsRuAGI5';

console.log('Testing Descope Configuration...');
console.log('Project ID:', projectId);
console.log('Management Key:', managementKey ? 'Present' : 'Missing');

// Test basic connectivity and project info
async function testDescopeConfig() {
    try {
        console.log('\n1. Testing basic project info...');
        // Try to get project info using the correct endpoint
        const response = await axios.get(`https://api.descope.com/v1/mgmt/project`, {
            headers: {
                'Authorization': `Bearer ${projectId}:${managementKey}`,
                'Content-Type': 'application/json',
            },
        });
        
        console.log('✅ Project accessible');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.error('❌ Error accessing project:', error.response?.status);
        if (error.response?.data) {
            console.error('Error details:', error.response.data);
        }
        
        // Try alternative endpoint for project validation
        try {
            console.log('\n2. Testing project validation...');
            const validationResponse = await axios.post(
                `https://api.descope.com/v1/auth/webauthn/sign-up/start`,
                {
                    loginId: 'test@example.com',
                    user: {
                        name: 'Test User',
                        email: 'test@example.com'
                    },
                    origin: 'http://localhost:3000'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${projectId}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('✅ Project is valid and accepts authentication requests');
        } catch (authError) {
            console.error('❌ Project configuration issue:', authError.response?.status);
            if (authError.response?.data) {
                console.error('Auth error details:', authError.response.data);
            }
        }
    }
    
    // Test if localhost:3000 is allowed
    console.log('\n3. Domain Check:');
    console.log('Current test domain: http://localhost:3000');
    console.log('Make sure this domain is configured in Descope project settings');
    
    // Test flow ID
    console.log('\n4. Flow Configuration:');
    console.log('Flow ID: sign-up-or-in');
    console.log('Make sure this flow exists in your Descope project');
}

testDescopeConfig();