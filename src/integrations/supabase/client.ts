
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wtlzhyfrfidnlqzucjbs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0bHpoeWZyZmlkbmxxenVjamJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTg1MzEsImV4cCI6MjA1NjI3NDUzMX0.x1Ea4n5szINnqU2KdZJIDw8Fo6WrbvEvoJQPPsP6kRo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
