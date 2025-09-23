import { Comment } from '../types';

export const exportCommentsToCSV = (comments: Comment[], draftTitle: string) => {
  const headers = ['Date', 'User Email', 'Comment', 'Sentiment'];
  const rows = comments.map(comment => [
    new Date(comment.timestamp).toLocaleDateString(),
    comment.userEmail,
    `"${comment.content.replace(/"/g, '""')}"`, // Escape quotes
    comment.sentiment || 'Not analyzed'
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${draftTitle.replace(/[^a-zA-Z0-9]/g, '_')}_comments.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};