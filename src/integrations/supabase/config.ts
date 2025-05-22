// Universal Supabase configuration using process.env (works for Vite and Node/Jest)

export const SUPABASE_CONFIG = {
  url: process.env.VITE_SUPABASE_URL || '',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
  // Service role key should only be used server-side (never exposed to client)
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
}; 