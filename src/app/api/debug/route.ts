import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const results: {
    timestamp: string;
    env: { hasSupabaseUrl: boolean; hasSupabaseKey: boolean };
    tables: Record<string, { exists: boolean; count?: number; error?: string | null }>;
    supabaseError?: string;
  } = {
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    tables: {},
  };

  try {
    const supabase = await createClient();
    
    // Test each table
    const tables = ["plugins", "maps", "textures", "ideas", "mods", "servers"];
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select("id", { count: "exact", head: true });
        
        results.tables[table] = {
          exists: !error,
          count: count ?? 0,
          error: error?.message ?? null,
        };
      } catch (e) {
        results.tables[table] = {
          exists: false,
          error: e instanceof Error ? e.message : "Unknown error",
        };
      }
    }
  } catch (e) {
    results.supabaseError = e instanceof Error ? e.message : "Unknown error";
  }

  return NextResponse.json(results);
}

