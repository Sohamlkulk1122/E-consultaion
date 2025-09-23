import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Header from './Header';
import { Users, MessageSquare, BarChart3, FileText, Download } from 'lucide-react';
import { drafts } from '../data/drafts';
import AdminAnalytics from './AdminAnalytics';

const AdminDashboard: React.FC = () => {
  const { comments, users } = useData();
  const [selectedDraftId, setSelectedDraftId] = useState<number | null>(null);

  const commentsByDraft = drafts.reduce((acc, draft) => {
    acc[draft.id] = comments.filter(c => c.draftId === draft.id);
    return acc;
  }, {} as Record<number, any[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-black mb-12 tracking-tight bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border-2 border-black rounded-xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <Users size={32} />
              <div>
                <h3 className="text-3xl font-black">{users.length}</h3>
                <p className="text-gray-700 font-medium">Registered Users</p>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-black rounded-xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <MessageSquare size={32} />
              <div>
                <h3 className="text-3xl font-black">{comments.length}</h3>
                <p className="text-gray-700 font-medium">Total Comments</p>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-black rounded-xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <FileText size={32} />
              <div>
                <h3 className="text-3xl font-black">{drafts.length}</h3>
                <p className="text-gray-700 font-medium">Active Drafts</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Drafts and Comments */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight">Draft Comments Overview</h2>
          
          {drafts.map((draft) => {
            const draftComments = commentsByDraft[draft.id] || [];
            
            return (
              <div key={draft.id} className="border-2 border-black rounded-xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black mb-2 tracking-tight">{draft.title}</h3>
                    <p className="text-sm text-gray-700 mb-2 font-medium">{draft.category}</p>
                    <p className="text-sm text-gray-600 font-semibold">{draftComments.length} comments</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedDraftId(draft.id)}
                      className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <BarChart3 size={16} />
                      Analyze Comments
                    </button>
                  </div>
                </div>
                
                {draftComments.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {draftComments.slice(0, 3).map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{comment.userEmail}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                    {draftComments.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{draftComments.length - 3} more comments
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      
      {selectedDraftId && (
        <AdminAnalytics
          draftId={selectedDraftId}
          onClose={() => setSelectedDraftId(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;