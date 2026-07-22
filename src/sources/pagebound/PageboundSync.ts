import type { EntityRepository } from "@/repositories/EntityRepository";
import type { MetadataRepository } from "@/repositories/MetadataRepository";
import type { RelationshipRepository } from "@/repositories/RelationshipRepository";
import type { SourceSyncRepository } from "@/repositories/SourceSyncRepository";
import type { TrackableRepository } from "@/repositories/TrackableRepository";

import type { PageboundClient } from "./PageboundClient";
import type { PageboundNormalizer } from "./PageboundNormalizer";

export class PageboundSync {
  constructor(
    private client: PageboundClient,
    private normalizer: PageboundNormalizer,
    private entities: EntityRepository,
    private metadata: MetadataRepository,
    private relationships: RelationshipRepository,
    private trackable: TrackableRepository,
    private syncs: SourceSyncRepository,
  ) { }

  async run() {
    await this.runFinishedBooks();
    await this.runCurrentBooks();
    await this.runToBeReadBooks();
  }

  async runFinishedBooks() {
    const syncId = await this.syncs.start("pagebound_finished");

    try {
      const books = await this.client.fetchFinishedBooks();

      let processed = 0;

      for (const book of books) {
        const normalized = this.normalizer.normalizeBooks(book);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: normalized.kind,
          title: normalized.title,
          source: normalized.source,
          externalId: normalized.externalId,
        });

        await this.metadata.upsert(entityId, normalized.metadata);
        await this.trackable.upsert({
          entityId,
          status: "completed",
          progress: book.progress,
        });

        processed++;
      }

      await this.syncs.success(syncId, {
        books_processed: processed,
      });
    }
    catch (e) {
      await this.syncs.fail(syncId, e as Error);
      throw e;
    }
  }

  async runCurrentBooks() {
    const syncId = await this.syncs.start("pagebound_current");

    try {
      const books = await this.client.fetchCurrentBooks();

      let processed = 0;

      for (const book of books) {
        const normalized = this.normalizer.normalizeBooks(book);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: normalized.kind,
          title: normalized.title,
          source: normalized.source,
          externalId: normalized.externalId,
        });

        await this.metadata.upsert(entityId, normalized.metadata);
        await this.trackable.upsert({
          entityId,
          status: "in_progress",
          progress: book.progress,
          startedAt: book.current_reading_instance?.started_reading_at_date,
          finishedAt: book.current_reading_instance?.finished_reading_at_date ?? undefined,
        });

        processed++;
      }

      await this.syncs.success(syncId, {
        books_processed: processed,
      });
    }
    catch (e) {
      await this.syncs.fail(syncId, e as Error);
      throw e;
    }
  }

  async runToBeReadBooks() {
    const syncId = await this.syncs.start("pagebound_tbr");

    try {
      const books = await this.client.fetchToBeReadBooks();

      let processed = 0;

      for (const book of books) {
        const normalized = this.normalizer.normalizeBooks(book);

        const { entityId } = await this.entities.getOrCreateFromSource({
          kind: normalized.kind,
          title: normalized.title,
          source: normalized.source,
          externalId: normalized.externalId,
        });

        await this.metadata.upsert(entityId, normalized.metadata);
        await this.trackable.upsert({
          entityId,
          status: "backlog",
          progress: book.progress,
        });

        processed++;
      }

      await this.syncs.success(syncId, {
        books_processed: processed,
      });
    }
    catch (e) {
      await this.syncs.fail(syncId, e as Error);
      throw e;
    }
  }
}
