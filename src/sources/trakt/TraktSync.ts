import type { EntityRepository } from "@/repositories/EntityRepository";
import type { TraktClient } from "./TraktClient";
import type { TraktNormalizer } from "./TraktNormalizer";
import type { MetadataRepository } from "@/repositories/MetadataRepository";
import type { RelationshipRepository } from "@/repositories/RelationshipRepository";
import type { SourceSyncRepository } from "@/repositories/SourceSyncRepository";

export class TraktSync {
  constructor(
    private client: TraktClient,
    private normalizer: TraktNormalizer,
    private entities: EntityRepository,
    private metadata: MetadataRepository,
    private relationships: RelationshipRepository,
    private syncs: SourceSyncRepository
  ) { }

  async run() {
    await this.runFavoriteShows();
    await this.runWatchlistShows();
  }

  async runFavoriteShows() {
    const syncId = await this.syncs.start("trakt_favorite_shows");

    try {
      const shows = await this.client.fetchFavoriteShows();

      let processed = 0;

      for (const show of shows) {
        const normalized = this.normalizer.normalizeFavoriteShow(show);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: normalized.kind,
          title: normalized.title,
          source: normalized.source,
          externalId: normalized.externalId
        });

        await this.metadata.upsert(entityId, { ...normalized.metadata, status: "favorite" });

        processed++;
      }

      await this.syncs.success(syncId, {
        shows_processed: processed
      })
    } catch (e) {
      await this.syncs.fail(syncId, e as Error);
      throw e;
    }
  }

  async runWatchlistShows() {
    const syncId = await this.syncs.start("trakt_watchlist_shows");

    try {
      const shows = await this.client.fetchWatchlistShows();

      let processed = 0;

      for (const show of shows) {
        const normalized = this.normalizer.normalizeWatchlistShow(show);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: normalized.kind,
          title: normalized.title,
          source: normalized.source,
          externalId: normalized.externalId
        });

        await this.metadata.upsert(entityId, { ...normalized.metadata, status: "watchlist" });

        processed++;
      }

      await this.syncs.success(syncId, {
        shows_processed: processed
      })
    } catch (e) {
      await this.syncs.fail(syncId, e as Error);
      throw e;
    }
  }
}