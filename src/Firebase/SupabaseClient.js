import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qaibprcdanrwecebxhqp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaWJwcmNkYW5yd2VjZWJ4aHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDQ0NjMsImV4cCI6MjA1NzQ4MDQ2M30.v-VHBDm3y3KjPSHa5kXWOxkwharpdAF8HgB5vwQaEd8';

export const supabase = createClient(supabaseUrl, supabaseKey);