import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const result = sentiment.analyze(text);
  if (result.score > 0) return 'positive';
  if (result.score < 0) return 'negative';
  return 'neutral';
};

export const analyzeBulkSentiment = (texts: string[]) => {
  return texts.map(text => ({
    text,
    sentiment: analyzeSentiment(text),
    score: sentiment.analyze(text).score
  }));
};

export const getSentimentStats = (comments: Array<{content: string}>) => {
  const sentiments = comments.map(comment => analyzeSentiment(comment.content));
  const counts = sentiments.reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    positive: counts.positive || 0,
    negative: counts.negative || 0,
    neutral: counts.neutral || 0,
    total: sentiments.length
  };
};