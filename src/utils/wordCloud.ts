export const generateWordFrequency = (texts: string[]) => {
  const allText = texts.join(' ').toLowerCase();
  const words = allText.match(/\b[a-zA-Z]{3,}\b/g) || [];
  
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'will', 'would', 'could', 'should', 'this', 'that', 'these', 'those'
  ]);
  
  const wordCount = words
    .filter(word => !stopWords.has(word))
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  return Object.entries(wordCount)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // Top 50 words
};