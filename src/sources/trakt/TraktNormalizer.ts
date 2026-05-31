import type { TraktMovieListItem, TraktNormalizedMovie, TraktNormalizedShow, TraktShowListItem } from "./types";

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
        status,
      },
    };
  }

  private normalizeMovie(data: TraktMovieListItem, status: TraktNormalizedMovie["metadata"]["status"]): TraktNormalizedMovie {
    return {
      kind: "movie",
      title: data.movie.title,

      source: "trakt.tv",
      externalId: String(data.movie.ids.trakt),

      metadata: {
        genres: data.movie.genres,
        description: data.movie.overview,
        year: data.movie.year,
        status,
      },
    };
  }

  normalizeFavoriteShow(data: TraktShowListItem): TraktNormalizedShow {
    return this.normalizeShow(data, "favorite");
  }

  normalizeWatchlistShow(data: TraktShowListItem): TraktNormalizedShow {
    return this.normalizeShow(data, "watchlist");
  }

  normalizeFavoriteMovie(data: TraktMovieListItem): TraktNormalizedMovie {
    return this.normalizeMovie(data, "favorite");
  }

  normalizeWatchlistMovie(data: TraktMovieListItem): TraktNormalizedMovie {
    return this.normalizeMovie(data, "watchlist");
  }
}
