import type { EntityRepository } from "@/repositories/EntityRepository";
import type { MetadataRepository } from "@/repositories/MetadataRepository";
import type { SourceSyncRepository } from "@/repositories/SourceSyncRepository";
import type { TimeRepository } from "@/repositories/TimeRepository";

import { env } from "@/config/env";

import type { YouTubeClient } from "./YouTubeClient";
import type { YouTubeNormalizer } from "./YouTubeNormalizer";

export class YouTubeSync {
  constructor(
    private client: YouTubeClient,
    private normalizer: YouTubeNormalizer,
    private entities: EntityRepository,
    private metadata: MetadataRepository,
    private time: TimeRepository,
    private syncs: SourceSyncRepository,
  ) { }

  async run() {
    const syncId = await this.syncs.start("youtube");

    try {
      const videos = await this.client.fetchPlaylistVideos(env.YOUTUBE_PLAYLIST_ID);

      let processed = 0;

      for (const video of videos) {
        const normalize = this.normalizer.normalize(video);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: normalize.kind,
          title: normalize.title,
          source: normalize.source,
          externalId: normalize.externalId,
        });

        await this.metadata.upsert(entityId, normalize.metadata);

        if (normalize.timeSeconds)
          await this.time.recordTotalTime({ entityId, totalSeconds: normalize.timeSeconds });

        processed++;
      }

      await this.syncs.success(syncId, {
        videos_processed: processed,
      });
    }
    catch (e) {
      await this.syncs.fail(syncId, e as Error);
      throw e;
    }
  }
}
