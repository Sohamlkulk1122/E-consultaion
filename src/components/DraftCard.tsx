import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Draft } from '../types';
import { FileText, MessageSquare, Calendar, ExternalLink, Eye } from 'lucide-react';
import CommentSection from './CommentSection';

interface DraftCardProps {
  draft: Draft;
}

const DraftCard: React.FC<DraftCardProps> = ({ draft }) => {
  const [showComments, setShowComments] = useState(false);
  const { getCommentsByDraft } = useData();
  const { user } = useAuth();
  
  const comments = getCommentsByDraft(draft.id);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Company Section': 'bg-purple-100 text-purple-800 border-purple-200',
      'Law Side': 'bg-green-100 text-green-800 border-green-200',
      'Report': 'bg-orange-100 text-orange-800 border-orange-200',
      'Legislative Draft': 'bg-blue-100 text-blue-800 border-blue-200',
      'All Sectors': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:border-blue-200">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <span className={`px-4 py-2 text-sm font-bold rounded-full border ${getCategoryColor(draft.category)}`}>
              {draft.category}
            </span>
            <div className="flex items-center text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
              <Calendar size={14} className="mr-1" />
              {new Date(draft.publishedDate).toLocaleDateString()}
            </div>
          </div>
          
          <h3 className="text-xl font-black mb-4 line-clamp-2 tracking-tight text-blue-900 leading-tight">
            {draft.title}
          </h3>
          <p className="text-blue-700 text-base mb-6 leading-relaxed">
            {draft.description}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <a
            href={draft.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Eye size={16} />
            View Document
            <ExternalLink size={14} />
          </a>
          
          <button
            onClick={() => setShowComments(true)}
            className="flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 py-4 px-6 rounded-xl hover:bg-blue-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <MessageSquare size={16} />
            Share Feedback ({comments.length})
          </button>
        </div>
      </div>
      
      <CommentSection
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        draft={draft}
      />
    </>
  );
};

export default DraftCard;