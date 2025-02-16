// FILE: src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Our environment variable names for the client side
// If you are using Vite, you can reference them as import.meta.env.VAR_NAME.
// We'll assume they are `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);