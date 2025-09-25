import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Draft } from '../types';
import { X, Send, MessageSquare, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface CommentSectionProps {
  isOpen: boolean;
  onClose: () => void;
  draft: Draft;
}

const CommentSection: React.FC<CommentSectionProps> = ({ isOpen, onClose, draft }) => {
  const [newComment, setNewComment] = useState('');
  const { getCommentsByDraft, addComment } = useData();
  const { user } = useAuth();
  
  const comments = getCommentsByDraft(draft.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    addComment(draft.id, user.email || '', newComment.trim());
    setNewComment('');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
            <MessageSquare size={24} />
            Public Feedback - {draft.title}
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
                <MessageSquare size={32} className="text-blue-600" />
              </div>
              <p className="text-blue-600 text-lg font-medium">No feedback yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-blue-50 border border-blue-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-blue-900 text-sm">
                      {comment.userEmail.split('@')[0]}
                    </span>
                    <div className="flex items-center gap-2">
                      {comment.sentiment && (
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium flex items-center gap-1 ${getSentimentColor(comment.sentiment)}`}>
                          {getSentimentIcon(comment.sentiment)}
                          {comment.sentiment}
                        </span>
                      )}
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-blue-800 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-blue-100 p-6 bg-blue-50">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts and feedback on this legislative draft..."
              className="flex-1 p-4 border-2 border-blue-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Send size={16} />
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;