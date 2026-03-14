import type { TraktNormalizedShow, TraktShowListItem } from "./types";

export class TraktNormalizer {
  private normalizeShow(data: TraktShowListItem, status: TraktNormalizedShow["metadata"]["status"]): TraktNormalizedShow {
    return {
      kind: "show",
      title: data.show.title,

      source: "trakt.tv",
      externalId: String(data.show.ids.trakt),

      metadata: {
        genres: data.show.genres,
        description: data.show.overview,
        year: data.show.year,
        status
      }
    }
  }

  normalizeFavoriteShow(data: TraktShowListItem): TraktNormalizedShow {
    return this.normalizeShow(data, "favorite");
  }

  normalizeWatchlistShow(data: TraktShowListItem): TraktNormalizedShow {
    return this.normalizeShow(data, "watchlist");
  }
}