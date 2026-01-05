import type { EntityRepository } from "@/repositories/EntityRepository";
import type { MetadataRepository } from "@/repositories/MetadataRepository";
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
    private time: TimeRepository,
    private syncs: SourceSyncRepository,
  ) { }

  async run() {
    const syncId = await this.syncs.start("steam");

    try {
      const games = await this.client.fetchOwnedGames();

      let processed = 0;

      for (const game of games) {
        const normalized = this.normalizer.normalize(game);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: normalized.kind,
          title: normalized.title,
          source: normalized.source,
          externalId: normalized.externalId,
        });

        await this.metadata.upsert(entityId, normalized.metadata);
        await this.time.recordTotalTime({ entityId, totalSeconds: normalized.timeSeconds });

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
}
