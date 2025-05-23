
// Using hardcoded Supabase URL and anon key for browser/frontend code
// This is safe for client-side code since these are public values

// Supabase project ID from the project settings
const projectId = 'qjgzqgpfqztkgggxxqkk';
const url = `https://${projectId}.supabase.co`;
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqZ3pxZ3BmcXp0a2dnZ3h4cWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjc4OTMsImV4cCI6MjA2MTcwMzg5M30.vuBfmpdanQJ7CUkEu8kd6C-PUdCLow6tinfvIt3O7Pg';

// Service role key will still try to use environment variable if available
const serviceRoleKey = typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : '';

console.log('Frontend Supabase Configuration:', { 
  url, 
  hasAnonKey: !!anonKey,
  hasServiceRoleKey: !!serviceRoleKey,
  environment: import.meta.env?.MODE || 'unknown'
});

export const SUPABASE_CONFIG = {
  url,
  anonKey,
  serviceRoleKey,
}; 
