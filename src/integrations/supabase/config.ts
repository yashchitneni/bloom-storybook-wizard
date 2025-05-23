// Always use hosted Supabase URL and anon key for browser/frontend code

const getEnvVar = (key: string): string => {
  // First try Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  // Then try process.env (for Node.js)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // If neither exists, throw an error
  throw new Error(`Environment variable ${key} is not defined`);
};

const url = getEnvVar('VITE_SUPABASE_URL');
const anonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');
const serviceRoleKey = typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : '';

console.log('Frontend Supabase Configuration:', { 
  url, 
  hasAnonKey: !!anonKey,
  hasServiceRoleKey: !!serviceRoleKey,
  environment: import.meta.env.MODE
});

export const SUPABASE_CONFIG = {
  url,
  anonKey,
  serviceRoleKey,
}; 