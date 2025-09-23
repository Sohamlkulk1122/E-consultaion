import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Draft } from '../types';
import { X, Send, MessageSquare } from 'lucide-react';

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
    
    addComment(draft.id, user.email, newComment.trim());
    setNewComment('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare size={24} />
            Comments - {draft.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{comment.userEmail}</span>
                    <div className="flex items-center gap-2">
                      {comment.sentiment && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          comment.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          comment.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {comment.sentiment}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t p-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this draft..."
              className="flex-1 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Send size={16} />
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;