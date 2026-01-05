import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/db/types";

export interface IMetadataRepository {
  upsert: (entityId: number, metadata: Json) => Promise<void>;
}

export class MetadataRepository implements IMetadataRepository {
  constructor(private db: SupabaseClient<Database>) { }

  async upsert(entityId: number, metadata: Json) {
    const { error } = await this.db
      .from("entity_metadata")
      .upsert({ entity_id: entityId, data: metadata }, { onConflict: "entity_id" });

    if (error)
      throw error;
  }
}
