import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/db/types";

export interface ISourceSyncRepository {
  start: (source: string) => Promise<number>;
  success: (id: number, stats: Json) => Promise<void>;
  fail: (id: number, error: Error) => Promise<void>;
}

export class SourceSyncRepository implements ISourceSyncRepository {
  constructor(private db: SupabaseClient<Database>) { }

  async start(source: string): Promise<number> {
    const { data, error } = await this.db
      .from("source_syncs")
      .insert({ source, status: "running" })
      .select("id")
      .single();

    if (error)
      throw error;

    return data.id;
  }

  async success(id: number, stats: Json) {
    const { error } = await this.db
      .from("source_syncs")
      .update({
        status: "success",
        finished_at: new Date().toISOString(),
        stats,
      })
      .eq("id", id);

    if (error)
      throw error;
  }

  async fail(id: number, errorObj: Error) {
    const { error } = await this.db
      .from("source_syncs")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error_message: errorObj.message,
      })
      .eq("id", id);

    if (error)
      throw error;
  }
}
