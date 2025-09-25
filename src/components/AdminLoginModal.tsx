import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Shield } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (adminLogin(email, password)) {
      onClose();
    } else {
      setError('Invalid administrator credentials');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900">Administrator Access</h2>
          <p className="text-blue-600 font-medium">Secure portal login</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin@123"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/50"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors font-bold shadow-lg"
          >
            Access Admin Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;