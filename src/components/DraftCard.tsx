import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Draft } from '../types';
import { FileText, MessageSquare, Calendar, ExternalLink } from 'lucide-react';
import CommentSection from './CommentSection';

interface DraftCardProps {
  draft: Draft;
}

const DraftCard: React.FC<DraftCardProps> = ({ draft }) => {
  const [showComments, setShowComments] = useState(false);
  const { getCommentsByDraft } = useData();
  const { user } = useAuth();
  
  const comments = getCommentsByDraft(draft.id);

  return (
    <>
      <div className="border-2 border-black rounded-xl p-6 bg-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <span className="bg-black text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg">
              {draft.category}
            </span>
            <div className="flex items-center text-sm text-gray-700 font-medium">
              <Calendar size={16} className="mr-1" />
              {new Date(draft.publishedDate).toLocaleDateString()}
            </div>
          </div>
          
          <h3 className="text-xl font-black mb-3 line-clamp-2 tracking-tight">{draft.title}</h3>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">{draft.description}</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <a
            href={draft.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FileText size={16} />
            View Document
            <ExternalLink size={14} />
          </a>
          
          <button
            onClick={() => setShowComments(true)}
            className="flex items-center justify-center gap-2 border-2 border-black py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <MessageSquare size={16} />
            Comments ({comments.length})
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