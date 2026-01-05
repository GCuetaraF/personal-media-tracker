import type { EntityRepository } from "@/repositories/EntityRepository";
import type { MetadataRepository } from "@/repositories/MetadataRepository";
import type { RelationshipRepository } from "@/repositories/RelationshipRepository";
import type { SourceSyncRepository } from "@/repositories/SourceSyncRepository";

import type { RetroachievementsClient } from "./RetroachievementsClient";
import type { RetroachievementsNormalizer } from "./RetroachievementsNormalizer";

export class RetroachievementsSync {
  constructor(
    private client: RetroachievementsClient,
    private normalizer: RetroachievementsNormalizer,
    private entities: EntityRepository,
    private metadata: MetadataRepository,
    private relationships: RelationshipRepository,
    private syncs: SourceSyncRepository,
  ) { }

  async run() {
    await this.runGameProgress();
    await this.runAchievements();
  }

  async runGameProgress() {
    const syncId = await this.syncs.start("retroachievements_progress");

    try {
      const games = await this.client.fetchGameProgress();

      let processed = 0;

      for (const game of games) {
        const normalized = this.normalizer.normalizeGame(game);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: normalized.kind,
          title: normalized.title,
          source: normalized.source,
          externalId: normalized.externalId,
        });

        await this.metadata.upsert(entityId, normalized.metadata);

        processed++;
      }

      await this.syncs.success(syncId, {
        games_processed: processed,
      });
    }
    catch (e) {
      await this.syncs.fail(syncId, e as Error);
      throw e;
    }
  }

  async runAchievements() {
    const syncId = await this.syncs.start("retroachievements_achievements");

    try {
      const startDate = await this.entities.getLatestCreatedAt("achievement");
      const endDate = new Date().toISOString();

      const achievements = await this.client.fetchAchievementsBetween(startDate, endDate);

      let processed = 0;

      for (const achievement of achievements) {
        const normalized = this.normalizer.normalizeAchievement(achievement);

        const { entityId: achievementEntityId } = await this.entities.getOrCreateFromSource({
          kind: normalized.kind,
          title: normalized.title,
          source: normalized.source,
          externalId: normalized.externalId,
        });

        await this.metadata.upsert(achievementEntityId, normalized.metadata);

        const gameExternalId = normalized.metadata.retroachievements_game_id;

        const { entityId: gameEntityId } = await this.entities.getOrCreateFromSource({
          kind: "game",
          title: normalized.metadata.retroachievements_game_title,
          source: normalized.source,
          externalId: String(gameExternalId),
        });

        await this.relationships.createRelationship({
          parentId: gameEntityId,
          childId: achievementEntityId,
          type: "HAS_ACHIEVEMENT",
          parentKind: "game",
          childKind: "achievement",
        });

        processed++;
      }

      await this.syncs.success(syncId, {
        achievements_processed: processed,
      });
    }
    catch (error) {
      await this.syncs.fail(syncId, error as Error);
      throw error;
    }
  }
}
