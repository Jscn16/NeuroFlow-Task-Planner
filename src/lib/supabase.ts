import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseAvailable = Boolean(supabaseUrl && supabaseAnonKey);

// Create a real client only when env vars are present; otherwise return null and let the app fall back to local mode.
export const supabase: SupabaseClient | null = supabaseAvailable
    ? createClient(
        supabaseUrl || '',
        supabaseAnonKey || '',
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true
            }
        }
    )
    : null;

if (!supabaseAvailable) {
    console.warn('Supabase env vars missing; running in local-only mode.');
}
