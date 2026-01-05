import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/db/types";

export type TrackableStatus = "backlog" | "in_progress" | "completed";

export interface ITrackableRepository {
  upsert: (input: {
    entityId: number;
    status: TrackableStatus;
    progress?: number;
    startedAt?: string;
    finishedAt?: string;
  }) => Promise<void>;
}

export class TrackableRepository implements ITrackableRepository {
  constructor(private db: SupabaseClient<Database>) { }

  async upsert(input: {
    entityId: number;
    status: TrackableStatus;
    progress?: number;
    startedAt?: string;
    finishedAt?: string;
  }): Promise<void> {
    const { error } = await this.db
      .from("trackable_state")
      .upsert(
        {
          entity_id: input.entityId,
          status: input.status,
          progress: input.progress,
          started_at: input.startedAt,
          finished_at: input.finishedAt,
        },
        { onConflict: "entity_id" },
      );
    if (error)
      throw error;
  }
}
