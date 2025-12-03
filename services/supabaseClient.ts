import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hebecnzsijjhcoanbwtk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmVjbnpzaWpqaGNvYW5id3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Nzg4NzEsImV4cCI6MjA4MDM1NDg3MX0._QQPn3kcbneSnXYoWwwhAEBYrwQ8J-CgK3A0SMFgu14';

export const supabase = createClient(supabaseUrl, supabaseKey);