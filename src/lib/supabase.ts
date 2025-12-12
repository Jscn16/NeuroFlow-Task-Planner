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

/**
 * Quick connectivity check - tests if Supabase Auth is reachable from current domain.
 * Returns false within 3 seconds if unreachable, allowing quick fallback to local mode.
 */
export async function checkSupabaseConnectivity(): Promise<boolean> {
    if (!supabaseAvailable || !supabase) return false;

    try {
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 3000)
        );

        // Simple check - try to get session. If this works, Supabase auth is functional.
        const sessionPromise = supabase.auth.getSession();

        await Promise.race([sessionPromise, timeoutPromise]);
        return true;
    } catch {
        console.warn('Supabase connectivity check failed - this domain may not be on the allowed list.');
        return false;
    }
}
