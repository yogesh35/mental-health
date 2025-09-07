// Configuration validation utility
export const validateConfiguration = () => {
  const errors = [];
  const warnings = [];

  // Validate Descope configuration
  const descopeConfig = {
    projectId: process.env.REACT_APP_DESCOPE_PROJECT_ID,
    flowId: process.env.REACT_APP_DESCOPE_FLOW_ID,
    managementKey: process.env.REACT_APP_DESCOPE_MANAGEMENT_KEY
  };

  if (!descopeConfig.projectId) {
    errors.push('REACT_APP_DESCOPE_PROJECT_ID is missing');
  } else if (!descopeConfig.projectId.startsWith('P')) {
    warnings.push('Descope Project ID should start with "P"');
  }

  if (!descopeConfig.flowId) {
    warnings.push('REACT_APP_DESCOPE_FLOW_ID is missing, using default "sign-up-or-in"');
  }

  // Validate Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

  Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (!value) {
      errors.push(`REACT_APP_FIREBASE_${key.toUpperCase().replace(/([A-Z])/g, '_$1')} is missing`);
    }
  });

  // Validate Gemini API
  const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!geminiApiKey) {
    warnings.push('REACT_APP_GEMINI_API_KEY is missing - chatbot will not work');
  } else if (!geminiApiKey.startsWith('AIza')) {
    warnings.push('Gemini API key format may be incorrect');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    descopeConfig,
    firebaseConfig: {
      ...firebaseConfig,
      isConfigured: Object.values(firebaseConfig).every(v => v)
    }
  };
};

export const logConfigurationStatus = () => {
  const validation = validateConfiguration();
  
  console.group('🔧 Configuration Status');
  
  if (validation.isValid) {
    console.log('✅ All required configurations are present');
  } else {
    console.error('❌ Configuration errors found:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Configuration warnings:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  console.log('📊 Service Status:');
  console.log(`  - Descope: ${validation.descopeConfig.projectId ? '✅' : '❌'}`);
  console.log(`  - Firebase: ${validation.firebaseConfig.isConfigured ? '✅' : '❌'}`);
  console.log(`  - Gemini AI: ${process.env.REACT_APP_GEMINI_API_KEY ? '✅' : '❌'}`);
  
  console.groupEnd();
  
  return validation;
};
