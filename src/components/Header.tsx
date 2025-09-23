import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { History, LogOut, Shield } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

interface HeaderProps {
  onHistoryClick?: () => void;
  showUserActions?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick, showUserActions = false }) => {
  const { user, isAdmin, logout } = useAuth();
  const [showAdminModal, setShowAdminModal] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-gray-900 to-black text-white py-6 px-6 shadow-xl border-b-4 border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Government Web Portal</h1>
            <h2 className="text-xl font-light tracking-wide text-gray-300">E-Consultation</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {!isAdmin && !user && (
              <button
                onClick={() => setShowAdminModal(true)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Shield size={16} />
                Admin
              </button>
            )}
            
            {showUserActions && user && (
              <>
                <button
                  onClick={onHistoryClick}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <History size={16} />
                  History
                </button>
                
                <span className="text-lg font-medium">Welcome, {user.name}</span>
                
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            )}
            
            {isAdmin && (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <LogOut size={16} />
                Admin Logout
              </button>
            )}
          </div>
        </div>
      </header>
      
      <AdminLoginModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </>
  );
};

export default Header;