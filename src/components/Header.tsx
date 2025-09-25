import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { History, LogOut, Shield, Building2 } from 'lucide-react';
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
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <Building2 size={32} className="text-blue-900" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                  Government of India
                </h1>
                <h2 className="text-lg font-medium text-blue-100 tracking-wide">
                  E-Consultation Portal
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {!isAdmin && !user && (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-xl hover:bg-blue-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Shield size={16} />
                  Admin Portal
                </button>
              )}
              
              {showUserActions && user && (
                <>
                  <button
                    onClick={onHistoryClick}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <History size={16} />
                    My Comments
                  </button>
                  
                  <div className="bg-blue-700 px-4 py-2 rounded-xl">
                    <span className="text-sm font-medium text-blue-100">Welcome,</span>
                    <span className="text-lg font-bold text-white ml-1">
                      {user.user_metadata?.name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-xl hover:bg-blue-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              )}
              
              {isAdmin && (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-xl hover:bg-blue-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <LogOut size={16} />
                  Admin Logout
                </button>
              )}
            </div>
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