import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gzxnrhxswleubryhemyz.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eG5yaHhzd2xldWJyeWhlbXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTQ4ODQsImV4cCI6MjA3OTE5MDg4NH0.nMI1TZ1oRz_5aq_Oyp0xWxx_T8-SUWloYEaxNQagJxs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface VectorDocument {
  id: number;
  content: string;
  metadata: any;
  similarity: number;
}