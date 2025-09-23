import React from 'react';
import { Comment } from '../types';
import { X, Clock } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock size={24} />
            Your Comment History
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
            <p className="text-gray-500 text-center py-8">You haven't made any comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="mb-2">
                    <h3 className="font-medium text-sm text-blue-600 mb-1">
                      {getDraftTitle(comment.draftId)}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                      {comment.sentiment && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          comment.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          comment.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {comment.sentiment}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
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