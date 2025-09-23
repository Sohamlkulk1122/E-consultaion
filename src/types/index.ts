export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Draft {
  id: number;
  title: string;
  category: string;
  description: string;
  pdfUrl: string;
  publishedDate: string;
}

export interface Comment {
  id: string;
  draftId: number;
  userId: string;
  userEmail: string;
  content: string;
  timestamp: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface AdminStats {
  totalUsers: number;
  totalComments: number;
  commentsByDraft: Record<number, number>;
}