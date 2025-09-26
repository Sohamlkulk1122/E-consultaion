import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { X, Download, TrendingUp, MessageCircle, BarChart3, Sparkles, Brain, Target, Volume2, Languages, Loader2, Info } from 'lucide-react';
import { drafts } from '../data/drafts';
import { getSentimentStats, analyzeBulkSentiment } from '../utils/sentiment';
import { generateWordFrequency } from '../utils/wordCloud';
import { exportCommentsToCSV } from '../utils/csvExport';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { summarizeTexts } from '../utils/summary';
import { speakText } from '../utils/tts';
import { translateText, SUPPORTED_LANGS } from '../utils/translate';

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
	
	const summary = useMemo(() => summarizeTexts(draftComments.map(c => c.content)), [draftComments]);

	const [summaryLang, setSummaryLang] = useState('en');
	const [summaryTranslating, setSummaryTranslating] = useState(false);
	const [summaryTranslated, setSummaryTranslated] = useState<string | null>(null);
	const [summaryTranslatedLang, setSummaryTranslatedLang] = useState<string | null>(null);

	const [hoveredSentiment, setHoveredSentiment] = useState<string | null>(null);
	const [hoveredWord, setHoveredWord] = useState<string | null>(null);
	const [hoveredTimePoint, setHoveredTimePoint] = useState<any>(null);

	const sentimentData = [
		{ name: 'Positive', value: sentimentStats.positive, color: '#06d6a0', gradient: 'from-emerald-400 to-teal-500' },
		{ name: 'Negative', value: sentimentStats.negative, color: '#f72585', gradient: 'from-pink-500 to-rose-600' },
		{ name: 'Neutral', value: sentimentStats.neutral, color: '#4361ee', gradient: 'from-indigo-500 to-purple-600' },
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

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-blue-200">
					<p className="font-bold text-blue-900 mb-2">{`${label}`}</p>
					{payload.map((entry: any, index: number) => (
						<p key={index} className="text-sm" style={{ color: entry.color }}>
							{`${entry.name}: ${entry.value}`}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	const PieTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0];
			return (
				<div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-blue-200">
					<p className="font-bold text-blue-900">{data.name}</p>
					<p className="text-sm text-blue-700">{`Count: ${data.value}`}</p>
					<p className="text-sm text-blue-700">{`Percentage: ${((data.value / draftComments.length) * 100).toFixed(1)}%`}</p>
				</div>
			);
		}
		return null;
	};

	if (!draft) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
				<div className="flex items-center justify-between p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
					<h2 className="text-xl font-bold text-blue-900">Analytics Dashboard - {draft.title}</h2>
					<div className="flex items-center gap-2">
						<button
							onClick={handleExportCSV}
							className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors font-bold"
						>
							<Download size={16} />
							Export Data
						</button>
						<button
							onClick={onClose}
							className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-xl transition-colors"
						>
							<X size={24} />
						</button>
					</div>
				</div>
				
				<div className="flex-1 overflow-y-auto p-6">
					{draftComments.length === 0 ? (
						<p className="text-blue-600 text-center py-8 text-lg font-medium">No feedback available for analysis.</p>
					) : (
						<div className="space-y-8">
							{/* Summary Stats */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
									<div className="flex items-center gap-2 mb-2">
										<MessageCircle size={20} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" />
										<span className="font-bold text-blue-900">Total Responses</span>
										<Info size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</div>
									<p className="text-3xl font-black text-blue-900 group-hover:text-blue-700 transition-colors duration-300">{draftComments.length}</p>
									<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
										<p className="text-xs text-blue-600">Click to view all responses</p>
									</div>
								</div>
								<div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-6 rounded-2xl shadow-lg border border-emerald-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
									<div className="flex items-center gap-2 mb-2">
										<TrendingUp size={20} className="text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
										<span className="font-bold text-emerald-900">Positive</span>
										<Info size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</div>
									<p className="text-3xl font-black text-emerald-700 group-hover:text-emerald-600 transition-colors duration-300">{sentimentStats.positive}</p>
									<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
										<p className="text-xs text-emerald-600">{sentimentStats.positive > 0 ? `${((sentimentStats.positive / draftComments.length) * 100).toFixed(1)}% of total` : 'No positive feedback yet'}</p>
									</div>
								</div>
								<div className="bg-gradient-to-br from-pink-50 to-rose-100 p-6 rounded-2xl shadow-lg border border-pink-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
									<div className="flex items-center gap-2 mb-2">
										<BarChart3 size={20} className="text-pink-600 group-hover:scale-110 transition-transform duration-300" />
										<span className="font-bold text-pink-900">Negative</span>
										<Info size={14} className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</div>
									<p className="text-3xl font-black text-pink-700 group-hover:text-pink-600 transition-colors duration-300">{sentimentStats.negative}</p>
									<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
										<p className="text-xs text-pink-600">{sentimentStats.negative > 0 ? `${((sentimentStats.negative / draftComments.length) * 100).toFixed(1)}% of total` : 'No negative feedback yet'}</p>
									</div>
								</div>
								<div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-2xl shadow-lg border border-indigo-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
									<div className="flex items-center gap-2 mb-2">
										<Target size={20} className="text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
										<span className="font-bold text-indigo-900">Neutral</span>
										<Info size={14} className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</div>
									<p className="text-3xl font-black text-indigo-700 group-hover:text-indigo-600 transition-colors duration-300">{sentimentStats.neutral}</p>
									<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
										<p className="text-xs text-indigo-600">{sentimentStats.neutral > 0 ? `${((sentimentStats.neutral / draftComments.length) * 100).toFixed(1)}% of total` : 'No neutral feedback yet'}</p>
									</div>
								</div>
							</div>

							{/* Sentiment Analysis Chart */}
							<div className="bg-gradient-to-br from-slate-50 to-gray-100 border-2 border-slate-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
								<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
								<div className="relative">
									<div className="flex items-center gap-3 mb-8">
										<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
											<Brain size={24} className="text-white" />
										</div>
										<h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
											Sentiment Distribution Analysis
										</h3>
									</div>
									<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
										<div className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart
												onMouseEnter={() => setHoveredSentiment('chart')}
												onMouseLeave={() => setHoveredSentiment(null)}
											>
												<Pie
													data={sentimentData}
													cx="50%"
													cy="50%"
													labelLine={false}
													label={(props: any) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
													outerRadius={120}
													innerRadius={60}
													fill="#8884d8"
													dataKey="value"
													stroke="none"
													onMouseEnter={(data, index) => setHoveredSentiment(data.name)}
													onMouseLeave={() => setHoveredSentiment(null)}
												>
													{sentimentData.map((entry, index) => (
														<Cell 
															key={`cell-${index}`} 
															fill={entry.color}
															stroke={hoveredSentiment === entry.name ? '#ffffff' : 'none'}
															strokeWidth={hoveredSentiment === entry.name ? 3 : 0}
															style={{
																filter: hoveredSentiment === entry.name ? 'brightness(1.1)' : 'none',
																transform: hoveredSentiment === entry.name ? 'scale(1.05)' : 'scale(1)',
																transformOrigin: 'center',
																transition: 'all 0.3s ease'
															}}
														/>
													))}
												</Pie>
												<Tooltip content={<PieTooltip />} />
												<Legend 
													wrapperStyle={{ paddingTop: '20px' }}
													iconType="circle"
												/>
											</PieChart>
										</ResponsiveContainer>
										</div>
										<div className="grid grid-cols-3 gap-4 mt-6">
											{sentimentData.map((item, index) => (
												<div 
													key={index} 
													className={`bg-gradient-to-r ${item.gradient} p-4 rounded-xl text-white text-center shadow-lg transform hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
													onMouseEnter={() => setHoveredSentiment(item.name)}
													onMouseLeave={() => setHoveredSentiment(null)}
												>
													<div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
														{item.value > 0 ? `${((item.value / draftComments.length) * 100).toFixed(1)}%` : '0%'}
													</div>
													<div className="text-2xl font-black">{item.value}</div>
													<div className="text-sm font-medium opacity-90">{item.name}</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Word Frequency */}
							<div className="bg-gradient-to-br from-cyan-50 to-blue-100 border-2 border-cyan-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
								<div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
								<div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
								<div className="relative">
									<div className="flex items-center gap-3 mb-8">
										<div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl shadow-lg">
											<BarChart3 size={24} className="text-white" />
										</div>
										<h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
											Most Discussed Topics
										</h3>
									</div>
									<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
										<div className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart 
												data={wordFrequency.slice(0, 10)} 
												margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
												onMouseEnter={() => setHoveredWord('chart')}
												onMouseLeave={() => setHoveredWord(null)}
											>
												<defs>
													<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
														<stop offset="0%" stopColor="#06d6a0" />
														<stop offset="100%" stopColor="#0891b2" />
													</linearGradient>
													<linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
														<stop offset="0%" stopColor="#00c896" />
														<stop offset="100%" stopColor="#0ea5e9" />
													</linearGradient>
												</defs>
												<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
												<XAxis 
													dataKey="text" 
													angle={-45}
													textAnchor="end"
													height={80}
													tick={{ fontSize: 12, fill: '#475569' }}
												/>
												<YAxis tick={{ fontSize: 12, fill: '#475569' }} />
												<Tooltip content={<CustomTooltip />} />
												<Bar 
													dataKey="value" 
													fill={hoveredWord ? "url(#barGradientHover)" : "url(#barGradient)"}
													radius={[8, 8, 0, 0]}
													stroke="none"
													onMouseEnter={(data) => setHoveredWord(data.text)}
													onMouseLeave={() => setHoveredWord(null)}
													style={{
														transition: 'all 0.3s ease'
													}}
												/>
											</BarChart>
										</ResponsiveContainer>
										</div>
									</div>
								</div>
							</div>

							{/* Trends Over Time */}
							{trendsData.length > 1 && (
								<div className="bg-gradient-to-br from-violet-50 to-purple-100 border-2 border-violet-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
									<div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
									<div className="relative">
										<div className="flex items-center gap-3 mb-8">
											<div className="bg-gradient-to-r from-violet-500 to-purple-500 p-3 rounded-xl shadow-lg">
												<TrendingUp size={24} className="text-white" />
											</div>
											<h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
												Engagement Timeline
											</h3>
										</div>
										<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
											<div className="h-80">
											<ResponsiveContainer width="100%" height="100%">
												<LineChart 
													data={trendsData} 
													margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
													onMouseEnter={() => setHoveredTimePoint('chart')}
													onMouseLeave={() => setHoveredTimePoint(null)}
												>
													<defs>
														<linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
															<stop offset="0%" stopColor="#8b5cf6" />
															<stop offset="100%" stopColor="#ec4899" />
														</linearGradient>
														<linearGradient id="lineGradientHover" x1="0" y1="0" x2="1" y2="0">
															<stop offset="0%" stopColor="#a855f7" />
															<stop offset="100%" stopColor="#f472b6" />
														</linearGradient>
													</defs>
													<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
													<XAxis dataKey="date" tick={{ fontSize: 12, fill: '#475569' }} />
													<YAxis tick={{ fontSize: 12, fill: '#475569' }} />
													<Tooltip content={<CustomTooltip />} />
													<Line 
														type="monotone" 
														dataKey="comments" 
														stroke={hoveredTimePoint ? "url(#lineGradientHover)" : "url(#lineGradient)"} 
														strokeWidth={hoveredTimePoint ? 5 : 4}
														dot={{ 
															fill: '#8b5cf6', 
															strokeWidth: 2, 
															r: hoveredTimePoint ? 8 : 6,
															style: { transition: 'all 0.3s ease' }
														}}
														activeDot={{ 
															r: 10, 
															fill: '#ec4899',
															stroke: '#ffffff',
															strokeWidth: 3,
															style: { 
																filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
																transition: 'all 0.3s ease'
															}
														}}
														onMouseEnter={(data) => setHoveredTimePoint(data)}
														onMouseLeave={() => setHoveredTimePoint(null)}
													/>
												</LineChart>
											</ResponsiveContainer>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Word Cloud Display */}
							<div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
								<div className="absolute top-0 left-0 w-44 h-44 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
								<div className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-2xl"></div>
								<div className="relative">
									<div className="flex items-center gap-3 mb-8">
										<div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl shadow-lg">
											<Sparkles size={24} className="text-white" />
										</div>
										<h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
											Key Terms Visualization
										</h3>
									</div>
									<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 min-h-80 relative overflow-hidden">
									<div className="flex flex-wrap justify-center items-center gap-2 relative">
										{wordFrequency.slice(0, 20).map((word, index) => (
											<span
												key={word.text}
												onMouseEnter={() => setHoveredWord(word.text)}
												onMouseLeave={() => setHoveredWord(null)}
												className={`inline-block px-6 py-3 text-white rounded-full font-bold shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-110 ${
													index % 6 === 0 ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600' :
													index % 6 === 1 ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600' :
													index % 6 === 2 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' :
													index % 6 === 3 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' :
													index % 6 === 4 ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' :
													'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
												}`}
												style={{
													fontSize: `${Math.max(16, Math.min(36, word.value * 4 + 12))}px`,
													fontWeight: word.value > 3 ? '900' : '700',
													transform: `rotate(${Math.random() * 10 - 5}deg)`,
													margin: `${Math.random() * 6 - 3}px ${Math.random() * 6 - 3}px`,
													zIndex: Math.floor(Math.random() * 10),
													filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
												}}
											>
												{word.text}
												{hoveredWord === word.text && (
													<span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
														Mentioned {word.value} times
													</span>
												)}
											</span>
										))}
									</div>
									</div>
								</div>
							</div>

							{/* Summary */}
							<div className="bg-gradient-to-br from-slate-50 to-zinc-100 border-2 border-slate-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-400/20 to-zinc-400/20 rounded-full blur-3xl"></div>
								<div className="relative">
									<div className="flex items-center gap-3 mb-6">
										<div className="bg-gradient-to-r from-slate-600 to-zinc-600 p-3 rounded-xl shadow-lg">
											<MessageCircle size={24} className="text-white" />
										</div>
										<h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-700 to-zinc-700 bg-clip-text text-transparent">
											Executive Summary
										</h3>
									</div>
									<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
										<div className="bg-gradient-to-r from-slate-100 to-zinc-100 p-6 rounded-xl border-l-4 border-slate-500">
											<p className="text-slate-800 leading-relaxed text-lg font-medium">{summaryTranslated ?? summary}</p>
											<div className="flex flex-wrap items-center gap-2 mt-4">
												<button onClick={() => speakText(summaryTranslated ?? summary)} className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-md">
													<Volume2 size={14} />
													Speak
												</button>
												<select value={summaryLang} onChange={(e) => setSummaryLang(e.target.value)} className="border-2 border-blue-200 rounded-xl px-3 py-2 bg-white text-blue-900">
													{SUPPORTED_LANGS.map(l => (
														<option key={l.code} value={l.code}>{l.label}</option>
													))}
												</select>
												<button
													onClick={async () => {
														setSummaryTranslating(true);
														try {
															const base = summaryTranslated ?? summary;
															const t = await translateText(base, summaryLang);
															setSummaryTranslated(t);
															setSummaryTranslatedLang(summaryLang);
														} finally {
															setSummaryTranslating(false);
														}
													}}
													className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-md"
												>
													{summaryTranslating ? <Loader2 className="animate-spin" size={14} /> : <Languages size={14} />}
													Translate
												</button>
												{summaryTranslated && (
													<span className="text-xs text-slate-600 ml-2">Translated to {summaryTranslatedLang}</span>
												)}
												{summaryTranslated && (
													<button
														onClick={() => { setSummaryTranslated(null); setSummaryTranslatedLang(null); }}
														className="inline-flex items-center gap-2 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md"
													>
														Clear
													</button>
												)}
											</div>
										</div>
									</div>
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