import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "abc";
const supabaseAnonKey = "xyz";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dummy default export to satisfy the framework
export default function SupabaseUtil() {
  return null;
}
