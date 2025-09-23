import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';

const Landing: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success;
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await signup(email, password);
      }

      if (!success) {
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="max-w-md mx-auto pt-20 px-6">
        <div className="bg-white border-2 border-black rounded-xl p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-center mb-8 tracking-tight">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
                required
                minLength={6}
              />
            </div>
            
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-black hover:underline font-semibold text-lg"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
          
          {!isLogin && (
            <p className="mt-4 text-xs text-gray-600 text-center">
              Email verification will be sent upon successful registration.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Landing;