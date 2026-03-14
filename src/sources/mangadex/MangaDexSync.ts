import type { EntityRepository } from "@/repositories/EntityRepository";
import type { MangaDexClient } from "./MangaDexClient";
import type { MangaDexNormalizer } from "./MangaDexNormalizer";
import type { MetadataRepository } from "@/repositories/MetadataRepository";
import type { RelationshipRepository } from "@/repositories/RelationshipRepository";
import type { SourceSyncRepository } from "@/repositories/SourceSyncRepository";

export class MangaDexSync {
  constructor(
    private client: MangaDexClient,
    private normalizer: MangaDexNormalizer,
    private entities: EntityRepository,
    private metadata: MetadataRepository,
    private relationships: RelationshipRepository,
    private syncs: SourceSyncRepository
  ) { }

  async run() {
    const syncId = await this.syncs.start("mangadex_followed");

    try {
      const mangas = await this.client.fetchFollowedManga();

      let processed = 0;

      for (const manga of mangas) {
        const normalized = this.normalizer.normalizeManga(manga);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: normalized.kind,
          title: normalized.title,
          source: normalized.source,
          externalId: normalized.externalId
        });

        await this.metadata.upsert(entityId, normalized.metadata);

        processed++;
      }

      await this.syncs.success(syncId, {
        manga_processed: processed
      })
    } catch (e) {
      await this.syncs.fail(syncId, e as Error);
      throw e;
    }
  }
}