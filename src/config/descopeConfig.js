// Production configuration for Descope authentication
export const getDescopeConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = !isProduction;
  
  // Get current domain
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Define working domains for authentication
  const workingDomains = [
    'https://mental-health-support-76bptzvt5-yogeshs-projects-a7254b40.vercel.app', // Original working domain
    'https://new-web-99490ypkf-yogeshs-projects-a7254b40.vercel.app', // New production domain
    'https://new-web-app.vercel.app' // Custom domain if available
  ];
  
  // Use current domain if in production, fallback to first working domain
  const redirectUri = isProduction 
    ? (workingDomains.includes(currentDomain) ? currentDomain : workingDomains[0])
    : 'http://localhost:3000';
  
  return {
    projectId: process.env.REACT_APP_DESCOPE_PROJECT_ID,
    flowId: process.env.REACT_APP_DESCOPE_FLOW_ID || 'sign-up-or-in',
    managementKey: process.env.REACT_APP_DESCOPE_MANAGEMENT_KEY,
    
    // Environment-specific configurations
    redirectUri: redirectUri,
      
    // Base URL for Descope API
    baseUrl: 'https://api.descope.com',
    
    // Theme configuration for consistent styling
    theme: {
      primary: '#3B82F6',
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#6366F1'
    },
    
    // Environment flags
    isProduction,
    isDevelopment,
    
    // Debug mode (only in development)
    debug: isDevelopment,
    
    // Session configuration
    sessionConfig: {
      sessionTokenViaCookie: true,
      cookieSameSite: isProduction ? 'strict' : 'lax',
      cookieSecure: isProduction
    }
  };
};

// Validate Descope configuration
export const validateDescopeConfig = () => {
  const config = getDescopeConfig();
  const errors = [];
  const warnings = [];
  
  if (!config.projectId) {
    errors.push('REACT_APP_DESCOPE_PROJECT_ID is required');
  } else if (!config.projectId.startsWith('P')) {
    warnings.push('Descope Project ID should start with "P"');
  }
  
  if (!config.flowId) {
    warnings.push('REACT_APP_DESCOPE_FLOW_ID not set, using default');
  }
  
  if (config.isProduction && !config.managementKey) {
    warnings.push('Management key not set in production');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config
  };
};

// Log configuration status (for debugging)
export const logDescopeStatus = () => {
  const validation = validateDescopeConfig();
  
  console.group('🔐 Descope Configuration Status');
  console.log('Environment:', validation.config.isProduction ? 'Production' : 'Development');
  console.log('Project ID:', validation.config.projectId ? '✅ Set' : '❌ Missing');
  console.log('Flow ID:', validation.config.flowId || 'Default');
  console.log('Redirect URI:', validation.config.redirectUri);
  console.log('Domain:', typeof window !== 'undefined' ? window.location.origin : 'Server');
  
  if (validation.errors.length > 0) {
    console.error('❌ Errors:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Warnings:', validation.warnings);
  }
  
  console.groupEnd();
  
  return validation;
};
