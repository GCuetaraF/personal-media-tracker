import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/db/types";
import type { EntityKind } from "@/domain/entity/EntityKind";

export interface IEntityRepository {
  getOrCreateFromSource: (input: {
    kind: EntityKind;
    title: string;
    source: string;
    externalId: string;
  }) => Promise<{ entityId: number }>;
}

export class EntityRepository implements IEntityRepository {
  constructor(private db: SupabaseClient<Database>) { }

  async getOrCreateFromSource(input: {
    kind: EntityKind;
    title: string;
    source: string;
    externalId: string;
  }): Promise<{ entityId: number }> {
    const { data: existing, error: findError } = await this.db
      .from("source_identities")
      .select("entity_id")
      .eq("source", input.source)
      .eq("external_id", input.externalId)
      .maybeSingle();

    if (findError)
      throw findError;

    if (existing)
      return { entityId: existing.entity_id };

    const { data: entityData, error: entityError } = await this.db
      .from("entities")
      .insert({ kind: input.kind, title: input.title })
      .select("id")
      .single();

    if (entityError)
      throw entityError;

    const entityId = entityData.id;

    const { error: identityError } = await this.db
      .from("source_identities")
      .insert({ entity_id: entityId, source: input.source, external_id: input.externalId });
    if (identityError)
      throw identityError;

    return { entityId };
  }

  async getLatestCreatedAt(
    kind: EntityKind,
  ): Promise<string | undefined> {
    const { data, error } = await this.db
      .from("entities")
      .select("created_at")
      .eq("kind", kind)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error)
      throw error;
    return data?.created_at;
  }
}
