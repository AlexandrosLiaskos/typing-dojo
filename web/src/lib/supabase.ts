import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qkvljsredydbuwxyplwy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdmxqc3JlZHlkYnV3eHlwbHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMTM1MjYsImV4cCI6MjA4MDU4OTUyNn0.rR8kSLQlOkOhCUQucVcHvJd0im8rfzvWqZMrYMLklAg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

