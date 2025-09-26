import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Header from './Header';
import { Users, MessageSquare, BarChart3, FileText, TrendingUp } from 'lucide-react';
import { drafts } from '../data/drafts';
import AdminAnalytics from './AdminAnalytics';

const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 2000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

const AdminDashboard: React.FC = () => {
  const { comments, users } = useData();
  const [selectedDraftId, setSelectedDraftId] = useState<number | null>(null);

  const commentsByDraft = drafts.reduce((acc, draft) => {
    acc[draft.id] = comments.filter(c => c.draftId === draft.id);
    return acc;
  }, {} as Record<number, any[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <h1 className="text-4xl font-black mb-2 tracking-tight">
            Administrative Dashboard
          </h1>
          <p className="text-xl text-blue-100 font-medium">
            Monitor and analyze public consultation activities
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                <Users size={32} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
                  <AnimatedCounter end={16} />
                </h3>
                <p className="text-blue-700 font-bold group-hover:text-blue-600 transition-colors duration-300">Registered Citizens</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                  <p className="text-xs text-blue-500">Active user accounts</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                <MessageSquare size={32} className="text-green-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-green-700 group-hover:text-green-600 transition-colors duration-300">
                  <AnimatedCounter end={comments.length} />
                </h3>
                <p className="text-blue-700 font-bold group-hover:text-blue-600 transition-colors duration-300">Total Feedback</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                  <p className="text-xs text-green-500">Public responses received</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
                <FileText size={32} className="text-orange-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-orange-700 group-hover:text-orange-600 transition-colors duration-300">
                  <AnimatedCounter end={drafts.length} />
                </h3>
                <p className="text-blue-700 font-bold group-hover:text-blue-600 transition-colors duration-300">Active Consultations</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                  <p className="text-xs text-orange-500">Open for public input</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Drafts and Comments */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-blue-900">Consultation Overview</h2>
          
          {drafts.map((draft) => {
            const draftComments = commentsByDraft[draft.id] || [];
            
            return (
              <div key={draft.id} className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black mb-2 tracking-tight text-blue-900">{draft.title}</h3>
                    <p className="text-sm text-blue-700 mb-2 font-bold bg-blue-100 px-3 py-1 rounded-full inline-block">{draft.category}</p>
                    <p className="text-sm text-blue-600 font-bold flex items-center gap-1 hover:text-blue-800 transition-colors duration-300">
                      <MessageSquare size={16} />
                      <AnimatedCounter end={draftComments.length} /> public responses
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedDraftId(draft.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <BarChart3 size={16} />
                      Analyze Feedback
                    </button>
                  </div>
                </div>
                
                {draftComments.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {draftComments.slice(0, 3).map((comment) => (
                      <div key={comment.id} className="bg-blue-50 p-3 rounded-xl text-sm border border-blue-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-blue-900">{comment.userEmail.split('@')[0]}</span>
                          <span className="text-xs text-blue-600">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-blue-800">{comment.content}</p>
                      </div>
                    ))}
                    {draftComments.length > 3 && (
                      <p className="text-sm text-blue-600 text-center font-medium">
                        +{draftComments.length - 3} more responses
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