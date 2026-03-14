import type { MangaDexManga, MangaDexNormalizedManga } from "./types";

export class MangaDexNormalizer {
  normalizeManga(manga: MangaDexManga): MangaDexNormalizedManga {
    return {
      kind: "manga",
      title: this.getBestTitle(manga),

      source: "mangadex",
      externalId: manga.id,

      metadata: {
        description: manga.attributes.description?.en ?? manga.attributes.description?.jp ?? manga.attributes.description?.es,
        lastChapter: manga.attributes.lastChapter,
        year: manga.attributes.year,
        contentRating: manga.attributes.contentRating
      }
    }
  }

  private getBestTitle(manga: MangaDexManga) {
    const langPriority = ["en", "ja-ro", "ja"];

    const attrs = manga?.attributes;
    const { title, altTitles } = attrs;

    if (title) {
      for (const lang of langPriority) {
        if (title[lang]) return title[lang]
      }
    }

    if (altTitles) {
      for (const lang of langPriority) {
        for (const alt of altTitles) {
          if (alt[lang]) return alt[lang]
        }
      }
    }

    if (title) {
      const first = Object.values(title)[0]
      if (first) return first
    }

    if (altTitles) {
      for (const alt of altTitles) {
        const first = Object.values(alt)[0]
        if (first) return first
      }
    }

    return "Unknown title"
  }
}