import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Draft } from '../types';
import { X, Send, MessageSquare, ThumbsUp, ThumbsDown, Minus, Volume2, Languages, Loader2 } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/tts';
import { translateText, SUPPORTED_LANGS } from '../utils/translate';
import TranslateModal from './TranslateModal';

interface CommentSectionProps {
	isOpen: boolean;
	onClose: () => void;
	draft: Draft;
}

const CommentSection: React.FC<CommentSectionProps> = ({ isOpen, onClose, draft }) => {
	const [newComment, setNewComment] = useState('');
	const [composeLang, setComposeLang] = useState('en');
	const [composeTranslating, setComposeTranslating] = useState(false);
	const [composePreview, setComposePreview] = useState('');
	const [translateModal, setTranslateModal] = useState<{
		isOpen: boolean;
		originalText: string;
		translatedText: string;
		targetLanguage: string;
		languageLabel: string;
	}>({
		isOpen: false,
		originalText: '',
		translatedText: '',
		targetLanguage: '',
		languageLabel: ''
	});
	const { getCommentsByDraft, addComment } = useData();
	const { user } = useAuth();
	
	const comments = getCommentsByDraft(draft.id);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || !user) return;
		addComment(draft.id, user.email || '', newComment.trim());
		setNewComment('');
		setComposePreview('');
	};

	const getSentimentIcon = (sentiment?: string) => {
		switch (sentiment) {
			case 'positive':
				return <ThumbsUp size={16} className="text-green-600" />;
			case 'negative':
				return <ThumbsDown size={16} className="text-red-600" />;
			default:
				return <Minus size={16} className="text-gray-600" />;
		}
	};

	const getSentimentColor = (sentiment?: string) => {
		switch (sentiment) {
			case 'positive':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'negative':
				return 'bg-red-50 border-red-200 text-red-800';
			default:
				return 'bg-gray-50 border-gray-200 text-gray-800';
		}
	};

	const handleTranslateCompose = async () => {
		if (!newComment.trim()) return;
		setComposeTranslating(true);
		try {
			const translated = await translateText(newComment, composeLang);
			setComposePreview(translated);
		} finally {
			setComposeTranslating(false);
		}
	};

	const handleTranslateComment = async (text: string, targetLang: string) => {
		try {
			const translated = await translateText(text, targetLang);
			const langLabel = SUPPORTED_LANGS.find(l => l.code === targetLang)?.label || targetLang;
			setTranslateModal({
				isOpen: true,
				originalText: text,
				translatedText: translated,
				targetLanguage: targetLang,
				languageLabel: langLabel
			});
		} catch (error) {
			console.error('Translation failed:', error);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
				<div className="flex items-center justify-between p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
					<h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
						<MessageSquare size={24} />
						Public Feedback - {draft.title}
					</h2>
					<button
						onClick={onClose}
						className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-xl transition-colors"
					>
						<X size={24} />
					</button>
				</div>
				
				<div className="flex-1 overflow-y-auto p-6">
					{comments.length === 0 ? (
						<div className="text-center py-12">
							<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<MessageSquare size={32} className="text-blue-600" />
							</div>
							<p className="text-blue-600 text-lg font-medium">No feedback yet. Be the first to share your thoughts!</p>
						</div>
					) : (
						<div className="space-y-4">
							{comments.map((comment) => (
								<div key={comment.id} className="bg-blue-50 border border-blue-100 rounded-xl p-4 hover:shadow-md transition-shadow">
									<div className="flex items-center justify-between mb-3">
										<span className="font-bold text-blue-900 text-sm">
											{comment.userEmail.split('@')[0]}
										</span>
										<div className="flex items-center gap-2">
											{comment.sentiment && (
												<span className={`text-xs px-3 py-1 rounded-full border font-medium flex items-center gap-1 ${getSentimentColor(comment.sentiment)}`}>
													{getSentimentIcon(comment.sentiment)}
													{comment.sentiment}
												</span>
											)}
											<span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
												{new Date(comment.timestamp).toLocaleDateString()}
											</span>
										</div>
									</div>
									<p className="text-blue-800 leading-relaxed">{comment.content}</p>
									<div className="flex gap-2 mt-3">
										<button
											onClick={() => speakText(comment.content)}
											className="inline-flex items-center gap-1 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md"
										>
											<Volume2 size={14} />
											Speak
										</button>
										<button
											onClick={() => handleTranslateComment(comment.content, composeLang)}
											className="inline-flex items-center gap-1 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md"
										>
											<Languages size={14} />
											Translate
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				
				<div className="border-t border-blue-100 p-6 bg-blue-50">
					<form onSubmit={handleSubmit} className="flex gap-4">
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Share your thoughts and feedback on this legislative draft..."
							className="flex-1 p-4 border-2 border-blue-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
							rows={3}
							required
						/>
						<div className="flex flex-col gap-2 w-56">
							<div className="flex gap-2">
								<select
									value={composeLang}
									onChange={(e) => setComposeLang(e.target.value)}
									className="flex-1 border-2 border-blue-200 rounded-xl px-3 py-2 bg-white text-blue-900"
								>
									{SUPPORTED_LANGS.map(l => (
										<option key={l.code} value={l.code}>{l.label}</option>
									))}
								</select>
								<button
									type="button"
									onClick={handleTranslateCompose}
									className="inline-flex items-center justify-center gap-2 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-md"
								>
									{composeTranslating ? <Loader2 className="animate-spin" size={14} /> : <Languages size={14} />}
									Preview
								</button>
							</div>
							{composePreview && (
								<div className="text-xs text-blue-800 bg-white border border-blue-200 rounded-lg p-2">
									<strong>Preview ({composeLang}):</strong> {composePreview}
								</div>
							)}
							<div className="flex gap-2">
								<button type="button" onClick={() => speakText(newComment)} className="flex-1 inline-flex items-center justify-center gap-2 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-md">
									<Volume2 size={14} />
									Speak
								</button>
								<button
									type="submit"
									className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
								>
									<Send size={16} />
									Submit Feedback
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			
			<TranslateModal
				isOpen={translateModal.isOpen}
				onClose={() => setTranslateModal(prev => ({ ...prev, isOpen: false }))}
				originalText={translateModal.originalText}
				translatedText={translateModal.translatedText}
				targetLanguage={translateModal.targetLanguage}
				languageLabel={translateModal.languageLabel}
			/>
		</div>
	);
};

export default CommentSection;