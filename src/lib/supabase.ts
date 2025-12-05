import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const createSupabaseClient = (): SupabaseClient | null => {
    if (!isSupabaseConfigured) {
        console.warn('Supabase is not configured. Falling back to local-only mode.');
        return null;
    }

    return createClient(
        supabaseUrl || '',
        supabaseAnonKey || '',
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true
            }
        }
    );
};

export const supabase = createSupabaseClient();
