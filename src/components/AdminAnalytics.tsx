import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { X, Download, TrendingUp, MessageCircle, BarChart3 } from 'lucide-react';
import { drafts } from '../data/drafts';
import { getSentimentStats, analyzeBulkSentiment } from '../utils/sentiment';
import { generateWordFrequency } from '../utils/wordCloud';
import { exportCommentsToCSV } from '../utils/csvExport';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

interface AdminAnalyticsProps {
  draftId: number;
  onClose: () => void;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ draftId, onClose }) => {
  const { comments } = useData();
  
  const draft = drafts.find(d => d.id === draftId);
  const draftComments = comments.filter(c => c.draftId === draftId);
  
  const sentimentStats = useMemo(() => getSentimentStats(draftComments), [draftComments]);
  const wordFrequency = useMemo(() => generateWordFrequency(draftComments.map(c => c.content)), [draftComments]);
  
  const sentimentData = [
    { name: 'Positive', value: sentimentStats.positive, color: '#22c55e' },
    { name: 'Negative', value: sentimentStats.negative, color: '#ef4444' },
    { name: 'Neutral', value: sentimentStats.neutral, color: '#6b7280' },
  ];

  // Trends over time (comments per day)
  const trendsData = useMemo(() => {
    const commentsByDate = draftComments.reduce((acc, comment) => {
      const date = new Date(comment.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(commentsByDate)
      .map(([date, count]) => ({ date, comments: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [draftComments]);

  const handleExportCSV = () => {
    if (!draft) return;
    exportCommentsToCSV(draftComments, draft.title);
  };

  if (!draft) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Analytics - {draft.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {draftComments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments available for analysis.</p>
          ) : (
            <div className="space-y-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={20} />
                    <span className="font-bold">Total Comments</span>
                  </div>
                  <p className="text-3xl font-black">{draftComments.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-green-600" />
                    <span className="font-bold">Positive</span>
                  </div>
                  <p className="text-3xl font-black text-green-600">{sentimentStats.positive}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={20} className="text-red-600" />
                    <span className="font-bold">Negative</span>
                  </div>
                  <p className="text-3xl font-black text-red-600">{sentimentStats.negative}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">Neutral</span>
                  </div>
                  <p className="text-3xl font-black">{sentimentStats.neutral}</p>
                </div>
              </div>

              {/* Sentiment Analysis Chart */}
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-black mb-6 tracking-tight">Sentiment Analysis</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Word Frequency */}
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-black mb-6 tracking-tight">Most Frequent Words</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wordFrequency.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="text" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trends Over Time */}
              {trendsData.length > 1 && (
                <div className="bg-white border-2 border-black rounded-xl p-6 shadow-xl">
                  <h3 className="text-xl font-black mb-6 tracking-tight">Comments Trend Over Time</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="comments" stroke="#000" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Word Cloud Display */}
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-black mb-6 tracking-tight">Interactive Word Cloud</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg min-h-64 relative overflow-hidden">
                  <div className="flex flex-wrap justify-center items-center gap-1 relative">
                    {wordFrequency.slice(0, 20).map((word, index) => (
                      <span
                        key={word.text}
                        className="inline-block px-4 py-2 bg-black text-white rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer transform hover:scale-110"
                        style={{
                          fontSize: `${Math.max(16, Math.min(36, word.value * 4 + 12))}px`,
                          fontWeight: word.value > 3 ? '900' : '700',
                          transform: `rotate(${Math.random() * 20 - 10}deg)`,
                          margin: `${Math.random() * 8 - 4}px ${Math.random() * 8 - 4}px`,
                          zIndex: Math.floor(Math.random() * 10)
                        }}
                      >
                        {word.text}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;