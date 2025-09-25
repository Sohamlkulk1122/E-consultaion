import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const Landing: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const { login, signup, resendVerification } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setShowResendVerification(false);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await signup(email, password);
      }

      if (result.success) {
        if (!isLogin) {
          setSuccess('Registration successful! Please check your email and click the verification link to complete your account setup.');
          setShowResendVerification(true);
        }
      } else {
        setError(result.error || 'Authentication failed');
        if (result.error?.includes('verify your email')) {
          setShowResendVerification(true);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await resendVerification(email);
    if (result.success) {
      setSuccess('Verification email sent! Please check your inbox.');
    } else {
      setError(result.error || 'Failed to send verification email');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      
      <main className="max-w-md mx-auto pt-12 px-6">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-blue-100">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-blue-600" />
            </div>
            <h2 className="text-3xl font-black text-blue-900 mb-2">
              {isLogin ? 'Citizen Login' : 'Citizen Registration'}
            </h2>
            <p className="text-blue-600 font-medium">
              {isLogin ? 'Access your consultation portal' : 'Join the e-consultation platform'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-blue-50/50"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-3">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-blue-50/50"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            {showResendVerification && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-3 px-6 rounded-xl hover:bg-blue-200 transition-all duration-300 disabled:opacity-50 font-bold border border-blue-200"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Resend Verification Email
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw size={20} className="animate-spin" />
                  Processing...
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setShowResendVerification(false);
              }}
              className="text-blue-600 hover:text-blue-800 font-bold text-lg hover:underline transition-colors"
            >
              {isLogin ? "Don't have an account? Register here" : "Already registered? Sign in here"}
            </button>
          </div>
          
          {!isLogin && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-700 text-center font-medium">
                <CheckCircle size={16} className="inline mr-1" />
                Email verification is required to access the portal
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Landing;