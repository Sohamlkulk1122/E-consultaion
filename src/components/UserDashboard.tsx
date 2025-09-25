import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Header from './Header';
import DraftCard from './DraftCard';
import CommentHistory from './CommentHistory';
import { drafts } from '../data/drafts';
import { FileText, Users, MessageSquare } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getCommentsByUser } = useData();
  const [showHistory, setShowHistory] = useState(false);

  const userComments = user ? getCommentsByUser(user.email || '') : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header 
        onHistoryClick={() => setShowHistory(true)}
        showUserActions={true}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">
                Welcome to E-Consultation Portal
              </h1>
              <p className="text-xl text-blue-100 font-medium">
                Participate in shaping India's legislative future
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <Users size={48} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-blue-900">{drafts.length}</h3>
                <p className="text-blue-600 font-medium">Active Consultations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <MessageSquare size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-green-700">{userComments.length}</h3>
                <p className="text-blue-600 font-medium">Your Comments</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Users size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-orange-700">Active</h3>
                <p className="text-blue-600 font-medium">Participation Status</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-black text-blue-900 mb-6 tracking-tight">
            Legislative Drafts for Public Consultation
          </h2>
          <p className="text-blue-700 text-lg font-medium mb-8">
            Review proposed legislation and share your valuable feedback to help shape policy decisions.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} />
          ))}
        </div>
      </main>
      
      <CommentHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        comments={userComments}
      />
    </div>
  );
};

export default UserDashboard;