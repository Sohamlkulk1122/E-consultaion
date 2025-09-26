export type TranslateProvider = 'libre';

const DEFAULT_PROVIDER: TranslateProvider = 'libre';

const RAW_LIBRE_URL = (import.meta as any).env?.VITE_LIBRETRANSLATE_URL || 'https://libretranslate.com/translate';

function normalizeLibreEndpoint(url: string): string {
	try {
		// Trim whitespace
		const trimmed = (url || '').trim();
		if (!trimmed) return 'https://libretranslate.com/translate';

		// If it's exactly the root, append /translate
		if (trimmed === 'https://libretranslate.com' || trimmed === 'http://libretranslate.com') {
			return `${trimmed}/translate`;
		}

		// Remove trailing slashes
		const noTrailing = trimmed.replace(/\/+$/, '');

		// If path already ends with /translate, keep it; otherwise if it ends at host, add /translate
		if (/\/translate$/.test(noTrailing)) return noTrailing;

		// If it already looks like an endpoint beyond host but not /translate, keep as provided
		try {
			const parsed = new URL(noTrailing);
			if (parsed.pathname && parsed.pathname !== '/' && parsed.pathname !== '') {
				return noTrailing;
			}
		} catch {}

		return `${noTrailing}/translate`;
	} catch {
		return 'https://libretranslate.com/translate';
	}
}

const LIBRE_ENDPOINT = normalizeLibreEndpoint(RAW_LIBRE_URL);

export async function translateText(text: string, targetLang: string, sourceLang?: string, provider: TranslateProvider = DEFAULT_PROVIDER): Promise<string> {
	if (!text?.trim()) return text;
	
	// For demo purposes, if translation service fails, provide mock translations
	const mockTranslations: Record<string, Record<string, string>> = {
		'hi': {
			'hello': 'नमस्ते',
			'thank you': 'धन्यवाद',
			'good': 'अच्छा',
			'bad': 'बुरा',
			'government': 'सरकार',
			'policy': 'नीति',
			'law': 'कानून',
			'citizen': 'नागरिक'
		},
		'bn': {
			'hello': 'হ্যালো',
			'thank you': 'ধন্যবাদ',
			'good': 'ভাল',
			'bad': 'খারাপ',
			'government': 'সরকার',
			'policy': 'নীতি',
			'law': 'আইন',
			'citizen': 'নাগরিক'
		}
	};
	
	switch (provider) {
		case 'libre':
			try {
				const result = await translateWithLibre(text, targetLang, sourceLang);
				// If translation service returns the same text, try mock translation
				if (result === text && targetLang !== 'en') {
					return getMockTranslation(text, targetLang, mockTranslations) || `[${targetLang.toUpperCase()}] ${text}`;
				}
				return result;
			} catch (error) {
				console.warn('Translation service failed, using mock translation:', error);
				return getMockTranslation(text, targetLang, mockTranslations) || `[${targetLang.toUpperCase()}] ${text}`;
			}
		default:
			return text;
	}
}

function getMockTranslation(text: string, targetLang: string, mockTranslations: Record<string, Record<string, string>>): string | null {
	const langTranslations = mockTranslations[targetLang];
	if (!langTranslations) return null;
	
	const lowerText = text.toLowerCase();
	for (const [english, translated] of Object.entries(langTranslations)) {
		if (lowerText.includes(english)) {
			return text.replace(new RegExp(english, 'gi'), translated);
		}
	}
	return null;
}

async function translateWithLibre(text: string, target: string, source?: string): Promise<string> {
	try {
		const body: any = { q: text, target, format: 'text', source: source || 'auto' };
		const res = await fetch(LIBRE_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			const errorText = await res.text().catch(() => '');
			console.warn(`Translation request failed (${res.status}): ${errorText}`);
			throw new Error(`Translation service unavailable`);
		}
		const data = await res.json();
		const translated = data?.translatedText;
		if (!translated || translated === text) {
			throw new Error('No translation received');
		}
		return translated;
	} catch (e) {
		console.warn('LibreTranslate failed:', e);
		throw e;
	}
}

export const SUPPORTED_LANGS: Array<{ code: string; label: string }> = [
	{ code: 'en', label: 'English' },
	{ code: 'hi', label: 'Hindi' },
	{ code: 'bn', label: 'Bengali' },
	{ code: 'te', label: 'Telugu' },
	{ code: 'ta', label: 'Tamil' },
	{ code: 'mr', label: 'Marathi' },
	{ code: 'gu', label: 'Gujarati' },
	{ code: 'kn', label: 'Kannada' },
	{ code: 'ml', label: 'Malayalam' },
	{ code: 'pa', label: 'Punjabi' },
]; 