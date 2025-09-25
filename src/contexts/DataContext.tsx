import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Comment, User } from '../types';
import { analyzeSentiment } from '../utils/sentiment';

interface DataContextType {
  comments: Comment[];
  users: User[];
  addComment: (draftId: number, userEmail: string, content: string) => void;
  getCommentsByDraft: (draftId: number) => Comment[];
  getCommentsByUser: (userEmail: string) => Comment[];
  addUser: (user: User) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const stored = localStorage.getItem('comments');
      return stored ? JSON.parse(stored) as Comment[] : [];
    } catch {
      return [];
    }
  });
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('users');
      return stored ? JSON.parse(stored) as User[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem('comments', JSON.stringify(comments)); } catch {}
  }, [comments]);

  useEffect(() => {
    try { localStorage.setItem('users', JSON.stringify(users)); } catch {}
  }, [users]);

  const addComment = (draftId: number, userEmail: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      draftId,
      userId: userEmail,
      userEmail,
      content,
      timestamp: new Date().toISOString(),
      sentiment: analyzeSentiment(content)
    };
    setComments(prev => [...prev, newComment]);
  };

  const getCommentsByDraft = (draftId: number) => {
    return comments.filter(comment => comment.draftId === draftId);
  };

  const getCommentsByUser = (userEmail: string) => {
    return comments.filter(comment => comment.userEmail === userEmail);
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  return (
    <DataContext.Provider value={{
      comments,
      users,
      addComment,
      getCommentsByDraft,
      getCommentsByUser,
      addUser
    }}>
      {children}
    </DataContext.Provider>
  );
};