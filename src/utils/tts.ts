export function speakText(text: string, lang?: string) {
	if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
		console.warn('Speech synthesis not supported in this browser.');
		return;
	}
	if (!text || !text.trim()) return;

	// Cancel any ongoing speech
	window.speechSynthesis.cancel();

	const utterance = new SpeechSynthesisUtterance(text);
	if (lang) utterance.lang = lang;
	utterance.rate = 1;
	utterance.pitch = 1;
	utterance.volume = 1;
	window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
	if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
	window.speechSynthesis.cancel();
} 