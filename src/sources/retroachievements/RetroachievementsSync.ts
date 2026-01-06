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
      const startDateStr = await this.entities.getLatestCreatedAt("achievement");
      let startDate: number;

      if (!startDateStr) {
        const now = new Date();
        now.setMonth(now.getMonth() - 1);
        startDate = Math.floor(now.getTime() / 1000);
      }
      else {
        startDate = Math.floor(new Date(startDateStr).getTime() / 1000);
      }

      const endDate = Math.floor(Date.now() / 1000);

      const achievements = await this.client.fetchAchievementsBetween(startDate.toString(), endDate.toString());

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
