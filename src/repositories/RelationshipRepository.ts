import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/db/types";
import type { EntityKind } from "@/domain/entity/EntityKind";
import type { RelationshipType } from "@/domain/relationship/RelationshipType";

import { assertValidRelationship } from "@/domain/relationship/invariants";

export interface IRelationshipRepository {
  createRelationship: (input: {
    parentId: number;
    childId: number;
    type: RelationshipType;
  }) => Promise<void>;
}

export class RelationshipRepository implements IRelationshipRepository {
  constructor(private db: SupabaseClient<Database>) { }

  async createRelationship(input: {
    parentId: number;
    childId: number;
    type: RelationshipType;
    parentKind?: EntityKind;
    childKind?: EntityKind;
  }): Promise<void> {
    if (input.parentKind && input.childKind) {
      assertValidRelationship(input.parentKind, input.childKind, input.type);
    }

    if (input.parentId === input.childId)
      return;

    const { data: existingRel, error: relError } = await this.db
      .from("relationships")
      .select("id")
      .eq("parent_entity_id", input.parentId)
      .eq("child_entity_id", input.childId)
      .eq("relationship_type", input.type)
      .maybeSingle();

    if (relError)
      throw relError;

    if (existingRel)
      return;

    const { error } = await this.db
      .from("relationships")
      .insert({
        parent_entity_id: input.parentId,
        child_entity_id: input.childId,
        relationship_type: input.type,
      });

    if (error)
      throw error;
  }
}
