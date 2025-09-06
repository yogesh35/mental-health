import React, { useEffect } from 'react';
import { SignUpOrInFlow } from '@descope/react-sdk';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth component mounted');
    console.log('Descope Project ID:', 'P320pek6bTCR9UDC2zhl4bIC9LJg');
    console.log('Flow ID:', 'sign-up-or-in');
  }, []);

  const onSuccess = (e) => {
    console.log('Logged in!', e);
    navigate('/dashboard');
  };

  const onError = (err) => {
    console.log('Error!', err);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or create a new account to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-4 text-center text-sm text-gray-500">
            Loading Descope authentication...
          </div>
          <SignUpOrInFlow
            flowId="sign-up-or-in"
            onSuccess={onSuccess}
            onError={onError}
            theme="light"
            debug={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
