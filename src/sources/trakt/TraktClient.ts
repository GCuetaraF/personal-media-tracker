import type { TraktMovieListItem, TraktShowListItem } from "./types";

export class TraktClient {
  constructor(private clientId: string, private userId: string) { }

  async fetchFavoriteShows(): Promise<TraktShowListItem[]> {
    const url = `https://api.trakt.tv/users/${this.userId}/favorites`;

    const res = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!res.ok)
      throw new Error(`Trakt.tv API Error: ${res.status}`);

    const json = (await res.json()) as TraktShowListItem[];

    return json;
  }

  async fetchWatchlistShows(): Promise<TraktShowListItem[]> {
    const url = `https://api.trakt.tv/users/${this.userId}/watchlist/shows?extended=full`;

    const res = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!res.ok)
      throw new Error(`Trakt.tv API Error: ${res.status}`);

    const json = (await res.json()) as TraktShowListItem[];

    return json;
  }

  async fetchFavoriteMovies(): Promise<TraktMovieListItem[]> {
    const url = `https://api.trakt.tv/lists/favorites/items/shows`;

    const res = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!res.ok)
      throw new Error(`Trakt.tv API Error: ${res.status}`);

    const json = (await res.json()) as TraktMovieListItem[];

    return json;
  }

  async fetchWatchlistMovies(): Promise<TraktMovieListItem[]> {
    const url = `https://api.trakt.tv/users/${this.userId}/watchlist/movies?extended=full`;

    const res = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!res.ok)
      throw new Error(`Trakt.tv API Error: ${res.status}`);

    const json = (await res.json()) as TraktMovieListItem[];

    return json;
  }

  private getHeaders(): RequestInit["headers"] {
    return {
      "Content-Type": "application/json",
      "trakt-api-version": "2",
      "trakt-api-key": this.clientId,
    };
  }
}
