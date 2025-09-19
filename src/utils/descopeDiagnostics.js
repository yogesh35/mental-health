// Descope Authentication Diagnostic Tool
import { getDescopeConfig, validateDescopeConfig } from '../config/descopeConfig';

export const runDescopeDiagnostics = () => {
  console.log('🔍 Running Descope Authentication Diagnostics...\n');
  
  // 1. Environment Check
  console.log('📊 Environment Information:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- Current URL:', typeof window !== 'undefined' ? window.location.href : 'Server Side');
  console.log('- User Agent:', typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A');
  console.log('');
  
  // 2. Environment Variables Check
  console.log('🔐 Environment Variables Status:');
  const envVars = {
    'REACT_APP_DESCOPE_PROJECT_ID': process.env.REACT_APP_DESCOPE_PROJECT_ID,
    'REACT_APP_DESCOPE_FLOW_ID': process.env.REACT_APP_DESCOPE_FLOW_ID,
    'REACT_APP_DESCOPE_MANAGEMENT_KEY': process.env.REACT_APP_DESCOPE_MANAGEMENT_KEY,
    'REACT_APP_GEMINI_API_KEY': process.env.REACT_APP_GEMINI_API_KEY
  };
  
  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      console.log(`✅ ${key}: ${key.includes('KEY') ? '***HIDDEN***' : value}`);
    } else {
      console.log(`❌ ${key}: Missing`);
    }
  });
  console.log('');
  
  // 3. Descope Configuration Check
  console.log('⚙️ Descope Configuration:');
  const config = getDescopeConfig();
  console.log('- Project ID:', config.projectId ? '✅ Set' : '❌ Missing');
  console.log('- Flow ID:', config.flowId || 'Default (sign-up-or-in)');
  console.log('- Redirect URI:', config.redirectUri);
  console.log('- Environment:', config.isProduction ? 'Production' : 'Development');
  console.log('- Session Config:', config.sessionConfig);
  console.log('');
  
  // 4. Validation Results
  console.log('✅ Validation Results:');
  const validation = validateDescopeConfig();
  console.log('- Configuration Valid:', validation.isValid ? '✅ Yes' : '❌ No');
  
  if (validation.errors.length > 0) {
    console.log('❌ Errors:');
    validation.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.log('⚠️ Warnings:');
    validation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  console.log('');
  
  // 5. Production-Specific Checks
  if (config.isProduction) {
    console.log('🚀 Production-Specific Checks:');
    console.log('- HTTPS Protocol:', window.location.protocol === 'https:' ? '✅ Secure' : '❌ Insecure');
    console.log('- Domain:', window.location.hostname);
    console.log('- Cookie Security:', config.sessionConfig.cookieSecure ? '✅ Enabled' : '❌ Disabled');
    console.log('- SameSite Policy:', config.sessionConfig.cookieSameSite);
    console.log('');
  }
  
  // 6. Network Connectivity Check
  console.log('🌐 Network Connectivity:');
  const checkDescopeAPI = async () => {
    try {
      const response = await fetch('https://api.descope.com/health', {
        method: 'GET',
        mode: 'cors'
      });
      console.log('- Descope API:', response.ok ? '✅ Reachable' : '❌ Unreachable');
    } catch (error) {
      console.log('- Descope API: ❌ Connection Failed', error.message);
    }
  };
  
  checkDescopeAPI();
  
  // 7. Descope Console Configuration Checklist
  console.log('📋 Descope Console Configuration Checklist:');
  console.log('');
  console.log('Please verify these settings in your Descope Console:');
  console.log('https://app.descope.com/ → Project Settings');
  console.log('');
  console.log('✅ Allowed Origins (Authentication → Allowed Origins):');
  if (config.isProduction) {
    console.log(`   - ${window.location.origin}`);
    console.log('   - https://mental-health-support-*.vercel.app');
    console.log('   - https://*.vercel.app');
  } else {
    console.log('   - http://localhost:3000');
    console.log('   - http://127.0.0.1:3000');
  }
  console.log('');
  console.log('✅ Redirect URIs (Authentication → Redirect URIs):');
  if (config.isProduction) {
    console.log(`   - ${window.location.origin}/`);
    console.log(`   - ${window.location.origin}/auth`);
    console.log(`   - ${window.location.origin}/dashboard`);
  } else {
    console.log('   - http://localhost:3000/');
    console.log('   - http://localhost:3000/auth');
    console.log('   - http://localhost:3000/dashboard');
  }
  console.log('');
  console.log('✅ Flow Configuration (Flows → sign-up-or-in):');
  console.log('   - Flow is published');
  console.log('   - Email/Password authentication enabled');
  console.log('   - Flow completion redirects properly');
  console.log('');
  
  // 8. Troubleshooting Steps
  console.log('🔧 Troubleshooting Steps if Authentication Fails:');
  console.log('');
  console.log('1. Check browser console for errors');
  console.log('2. Verify Descope Console settings match this diagnostic');
  console.log('3. Clear browser cache and cookies');
  console.log('4. Test in incognito/private browsing mode');
  console.log('5. Check network tab for failed API calls');
  console.log('');
  
  return {
    config,
    validation,
    environment: {
      isProduction: config.isProduction,
      currentURL: typeof window !== 'undefined' ? window.location.href : 'N/A',
      protocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A'
    }
  };
};

// Auto-run diagnostics in development
if (process.env.NODE_ENV === 'development') {
  // Run diagnostics after DOM is loaded
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(runDescopeDiagnostics, 1000);
    });
  }
}

export default runDescopeDiagnostics;
