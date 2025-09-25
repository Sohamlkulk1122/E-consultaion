import React from 'react';
import { Comment } from '../types';
import { X, Clock, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { drafts } from '../data/drafts';

interface CommentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
}

const CommentHistory: React.FC<CommentHistoryProps> = ({ isOpen, onClose, comments }) => {
  if (!isOpen) return null;

  const getDraftTitle = (draftId: number) => {
    return drafts.find(d => d.id === draftId)?.title || 'Unknown Draft';
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp size={16} className="text-green-600" />;
      case 'negative':
        return <ThumbsDown size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'negative':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
            <Clock size={24} />
            Your Consultation History
          </h2>
          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-blue-600" />
              </div>
              <p className="text-blue-600 text-lg font-medium">You haven't participated in any consultations yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-blue-50 border border-blue-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="mb-3">
                    <h3 className="font-bold text-sm text-blue-700 mb-2">
                      {getDraftTitle(comment.draftId)}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                      {comment.sentiment && (
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium flex items-center gap-1 ${getSentimentColor(comment.sentiment)}`}>
                          {getSentimentIcon(comment.sentiment)}
                          {comment.sentiment}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-blue-800 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentHistory;