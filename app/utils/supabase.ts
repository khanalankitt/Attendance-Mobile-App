import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pipqkdciaiiukaohkeqf.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcHFrZGNpYWlpdWthb2hrZXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODI4OTUsImV4cCI6MjA2NTU1ODg5NX0.sp7WmDcXeE861L8_zeXfrcAAQkdMfeIauy98ey_egBs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dummy default export to satisfy the framework
export default function SupabaseUtil() {
    return null;
}
