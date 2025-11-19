import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables.\n' +
    'Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.\n' +
    'See backend/SUPABASE_SETUP.md for setup instructions.'
  );
}

// Check if URL is a placeholder
if (supabaseUrl.includes('your-') || supabaseUrl.includes('example') || !supabaseUrl.startsWith('http')) {
  throw new Error(
    'Invalid SUPABASE_URL in .env file.\n' +
    'Please replace the placeholder with your actual Supabase project URL.\n' +
    'Get it from: Supabase Dashboard → Settings → API → Project URL\n' +
    'Format: https://your-project-ref.supabase.co'
  );
}

// Check if key is a placeholder
if (supabaseKey.includes('your-') || supabaseKey.includes('example') || supabaseKey.length < 50) {
  throw new Error(
    'Invalid SUPABASE_SERVICE_ROLE_KEY in .env file.\n' +
    'Please replace the placeholder with your actual Supabase service role key.\n' +
    'Get it from: Supabase Dashboard → Settings → API → service_role key\n' +
    '⚠️  Keep this key secret! Never commit it to version control.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to generate CUID-like IDs
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

