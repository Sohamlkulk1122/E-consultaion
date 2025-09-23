import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Header from './Header';
import DraftCard from './DraftCard';
import CommentHistory from './CommentHistory';
import { drafts } from '../data/drafts';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getCommentsByUser } = useData();
  const [showHistory, setShowHistory] = useState(false);

  const userComments = user ? getCommentsByUser(user.email) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header 
        onHistoryClick={() => setShowHistory(true)}
        showUserActions={true}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-black mb-12 text-center tracking-tight bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">Legislative Drafts for Public Consultation</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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