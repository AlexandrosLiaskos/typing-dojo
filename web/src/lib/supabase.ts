import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://etrxkdwuxgbtwkoatqjw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cnhrZHd1eGdidHdrb2F0cWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzQyNDQsImV4cCI6MjA4MDIxMDI0NH0.xd8I2S1kvrni87VZfF6gURpwuPar7CHlSC3x533wAhc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

