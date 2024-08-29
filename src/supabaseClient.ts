// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase URL and Anon Key
const SUPABASE_URL = 'https://ocejxsdjzjmfjvkwefoj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZWp4c2RqemptZmp2a3dlZm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ3ODc0NzQsImV4cCI6MjA0MDM2MzQ3NH0.lCoC7S4KncxJN1kpGcjbftjL-fTd2Pqlz2pp2WjmD6E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
