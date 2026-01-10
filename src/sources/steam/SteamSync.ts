import type { EntityRepository } from "@/repositories/EntityRepository";
import type { MetadataRepository } from "@/repositories/MetadataRepository";
import type { RelationshipRepository } from "@/repositories/RelationshipRepository";
import type { SourceSyncRepository } from "@/repositories/SourceSyncRepository";
import type { TimeRepository } from "@/repositories/TimeRepository";

import type { SteamClient } from "./SteamClient";
import type { SteamNormalizer } from "./SteamNormalizer";

export class SteamSync {
  constructor(
    private client: SteamClient,
    private normalizer: SteamNormalizer,
    private entities: EntityRepository,
    private metadata: MetadataRepository,
    private relationships: RelationshipRepository,
    private time: TimeRepository,
    private syncs: SourceSyncRepository,
  ) { }

  async run() {
    const syncId = await this.syncs.start("steam");

    try {
      const games = await this.client.fetchOwnedGames();

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
        await this.time.recordTotalTime({ entityId, totalSeconds: normalized.timeSeconds });

        await this.runTopAchievements(game.appid);

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

  private async runTopAchievements(appid: number) {
    const syncId = await this.syncs.start("steam_achievements");

    try {
      const achievements = await this.client.fetchUserAchievementsWithMetadata(appid);

      let processedAchievements = 0;

      for (const achievement of achievements) {
        const normalizedAchievement = this.normalizer.normalizeAchievement(achievement);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: "achievement",
          title: normalizedAchievement.title,
          source: "steam",
          externalId: `${appid}-${normalizedAchievement.externalId}`,
        });

        await this.metadata.upsert(entityId, normalizedAchievement.metadata);

        const res = await this.entities.getFromSource({
          source: "steam",
          externalId: String(appid),
        });

        if (res?.entityId) {
          await this.relationships.createRelationship({
            parentId: res.entityId,
            parentKind: "game",
            childId: entityId,
            childKind: "achievement",
            type: "HAS_ACHIEVEMENT",
          });
        }

        processedAchievements++;
      }

      await this.syncs.success(syncId, {
        achievements_processed: processedAchievements,
      });
    }
    catch (e) {
      await this.syncs.fail(syncId, e as Error);
      throw e;
    }
  }
}
