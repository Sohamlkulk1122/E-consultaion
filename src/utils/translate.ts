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
	switch (provider) {
		case 'libre':
			return translateWithLibre(text, targetLang, sourceLang);
		default:
			return text;
	}
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
			throw new Error(`Translation request failed (${res.status}): ${errorText}`);
		}
		const data = await res.json();
		return data?.translatedText || text;
	} catch (e) {
		console.warn('Translation failed:', e);
		return text;
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