import React, { useContext, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    const res = await login(credentialResponse.credential);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  const handleGoogleFailure = () => {
    setError("Google Sign-In was unsuccessful. Try again.");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
      >
        <div className="text-center">
          <Utensils className="mx-auto h-12 w-12 text-primary-600 mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to order food and book your table
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            theme="outline"
            size="large"
            shape="rectangular"
            width="300"
          />
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Secure authentication via Google
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
