import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
	// Create a no-op client-like object to prevent runtime crashes when auth is unused
	client = {
		auth: {
			async getSession() { return { data: { session: null }, error: null }; },
			onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
			async signInWithPassword() { return { data: {}, error: new Error('Supabase not configured') }; },
			async signUp() { return { data: {}, error: new Error('Supabase not configured') }; },
			async signOut() { return { error: null }; },
			async resend() { return { error: new Error('Supabase not configured') }; }
		}
	} as unknown as ReturnType<typeof createClient>;
} else {
	client = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true
		}
	});
}

export const supabase = client;