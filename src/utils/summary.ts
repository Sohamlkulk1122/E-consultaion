// Basic extractive summary for an array of texts
// Heuristic: compute word frequencies (excluding stopwords), pick top keywords,
// and generate a short, human-readable summary string.

const STOPWORDS = new Set([
  'the','is','in','at','of','a','and','to','for','on','with','this','that','it','as','be','are','was','were','by','an','or','from','we','you','your','our','their','they','them','i','me','my','us','but','not','have','has','had','can','could','should','would','will','shall','do','does','did','about','into','over','more','most','some','any','such','no','nor','only','own','same','so','than','too','very','s','t','can','just','don','now'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => !STOPWORDS.has(token) && token.length > 2);
}

export function summarizeTexts(texts: string[], maxKeywords: number = 6): string {
  if (!texts || texts.length === 0) return 'No feedback available to summarize.';

  const freq: Record<string, number> = {};
  for (const t of texts) {
    for (const w of tokenize(t)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }

  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([w]) => w);

  if (keywords.length === 0) return 'Feedback contains varied inputs without dominant topics.';

  const primary = keywords.slice(0, 3);
  const secondary = keywords.slice(3, 6);

  const parts: string[] = [];
  parts.push(`Feedback centers on ${primary.join(', ')}${secondary.length ? ' and related themes' : ''}.`);
  if (secondary.length) {
    parts.push(`Other recurring topics include ${secondary.join(', ')}.`);
  }

  return parts.join(' ');
} 