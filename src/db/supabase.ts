import { createClient } from "@supabase/supabase-js";

import { env } from "@/config/env";

import type { Database } from "./types";

if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment");
}

export const db = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY);
