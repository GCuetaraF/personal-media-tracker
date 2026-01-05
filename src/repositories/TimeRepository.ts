import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/db/types";

export interface ITimeRepository {
  recordTotalTime: (input: { entityId: number; totalSeconds: number; source?: string }) => Promise<void>;
}

export class TimeRepository implements ITimeRepository {
  constructor(private db: SupabaseClient<Database>) { }

  async recordTotalTime(input: { entityId: number; totalSeconds: number; source?: string }): Promise<void> {
    const { data: existing, error: fetchError } = await this.db
      .from("time_state")
      .select("total_seconds")
      .eq("entity_id", input.entityId)
      .maybeSingle();

    if (fetchError)
      throw fetchError;

    let newTotal = input.totalSeconds;

    if (existing && typeof existing.total_seconds === "number") {
      newTotal = Math.max(existing.total_seconds, input.totalSeconds);
    }

    const { error } = await this.db
      .from("time_state")
      .upsert({ entity_id: input.entityId, total_seconds: newTotal }, { onConflict: "entity_id" });

    if (error)
      throw error;
  }
}
