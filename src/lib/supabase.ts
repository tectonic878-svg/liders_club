import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get credentials from environment variables or custom local storage
export function getSupabaseCredentials(): { url: string; key: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  const localUrl = localStorage.getItem('ubs_custom_supabase_url') || '';
  const localKey = localStorage.getItem('ubs_custom_supabase_key') || '';

  return {
    url: (envUrl || localUrl).trim(),
    key: (envKey || localKey).trim(),
  };
}

export function saveCustomSupabaseCredentials(url: string, key: string): void {
  if (url) {
    localStorage.setItem('ubs_custom_supabase_url', url.trim());
  } else {
    localStorage.removeItem('ubs_custom_supabase_url');
  }

  if (key) {
    localStorage.setItem('ubs_custom_supabase_key', key.trim());
  } else {
    localStorage.removeItem('ubs_custom_supabase_key');
  }

  // Reinitialize client
  initSupabaseClient();
}

let supabaseInstance: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  if (url && key && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: false,
        },
      });
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      supabaseInstance = null;
      return null;
    }
  }

  supabaseInstance = null;
  return null;
}

// Initial initialization
initSupabaseClient();

export function getSupabase(): SupabaseClient | null {
  if (!supabaseInstance) {
    return initSupabaseClient();
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}
