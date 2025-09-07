const { override } = require('customize-cra');

module.exports = override(
  (config, env) => {
    // Suppress webpack dev server deprecation warnings
    config.infrastructureLogging = {
      level: 'error',
    };
    
    // Suppress specific Node.js deprecation warnings
    if (env === 'development') {
      config.devServer = {
        ...config.devServer,
        setupMiddlewares: (middlewares, devServer) => {
          // This replaces the deprecated onBeforeSetupMiddleware and onAfterSetupMiddleware
          return middlewares;
        },
        // Remove deprecated options if they exist
        onBeforeSetupMiddleware: undefined,
        onAfterSetupMiddleware: undefined,
      };
    }
    
    // Only optimize bundle splitting for production builds
    if (env === 'production') {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  }
);
