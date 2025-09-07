import React, { useState, useEffect } from 'react';
import { validateConfiguration } from '../utils/configValidator';

const ConfigurationTest = () => {
  const [configStatus, setConfigStatus] = useState(null);
  const [firebaseTest, setFirebaseTest] = useState('testing');

  useEffect(() => {
    const validation = validateConfiguration();
    setConfigStatus(validation);

    // Test Firebase connection
    const testFirebase = async () => {
      try {
        const { studentService } = await import('../firebase/services');
        // Try to read from a non-existent document (this will test connection without writing)
        await studentService.getStudentProfile('test-connection');
        setFirebaseTest('connected');
      } catch (error) {
        console.error('Firebase test failed:', error);
        setFirebaseTest('failed');
      }
    };

    testFirebase();
  }, []);

  if (!configStatus) {
    return <div className="p-4">Loading configuration test...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">System Configuration Test</h2>
      
      <div className="space-y-4">
        {/* Overall Status */}
        <div className={`p-4 rounded-lg ${configStatus.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
          <h3 className="font-semibold">
            {configStatus.isValid ? '✅ Configuration Valid' : '❌ Configuration Issues Found'}
          </h3>
        </div>

        {/* Errors */}
        {configStatus.errors.length > 0 && (
          <div className="p-4 bg-red-50 border-red-200 border rounded-lg">
            <h4 className="font-semibold text-red-700 mb-2">Errors:</h4>
            <ul className="list-disc list-inside text-red-600">
              {configStatus.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {configStatus.warnings.length > 0 && (
          <div className="p-4 bg-yellow-50 border-yellow-200 border rounded-lg">
            <h4 className="font-semibold text-yellow-700 mb-2">Warnings:</h4>
            <ul className="list-disc list-inside text-yellow-600">
              {configStatus.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Service Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border rounded-lg">
            <h4 className="font-semibold">Descope Auth</h4>
            <p className={configStatus.descopeConfig.projectId ? 'text-green-600' : 'text-red-600'}>
              {configStatus.descopeConfig.projectId ? '✅ Configured' : '❌ Missing'}
            </p>
          </div>
          
          <div className="p-3 border rounded-lg">
            <h4 className="font-semibold">Firebase</h4>
            <p className={configStatus.firebaseConfig.isConfigured ? 'text-green-600' : 'text-red-600'}>
              {configStatus.firebaseConfig.isConfigured ? '✅ Configured' : '❌ Missing'}
            </p>
            <p className="text-sm">
              Connection: {firebaseTest === 'testing' ? '🔄 Testing...' : 
                         firebaseTest === 'connected' ? '✅ Connected' : '❌ Failed'}
            </p>
          </div>
          
          <div className="p-3 border rounded-lg">
            <h4 className="font-semibold">Gemini AI</h4>
            <p className={process.env.REACT_APP_GEMINI_API_KEY ? 'text-green-600' : 'text-red-600'}>
              {process.env.REACT_APP_GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}
            </p>
          </div>
        </div>

        {/* Configuration Details */}
        <details className="p-4 border rounded-lg">
          <summary className="cursor-pointer font-semibold">Configuration Details</summary>
          <div className="mt-4 text-sm space-y-2">
            <p><strong>Descope Project ID:</strong> {configStatus.descopeConfig.projectId || 'Not set'}</p>
            <p><strong>Firebase Project ID:</strong> {configStatus.firebaseConfig.projectId || 'Not set'}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ConfigurationTest;
