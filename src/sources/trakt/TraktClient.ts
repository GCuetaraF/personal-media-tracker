import type { TraktShowListItem } from "./types";

export class TraktClient {
  constructor(private clientId: string, private userId: string) { }

  async fetchFavoriteShows(): Promise<TraktShowListItem[]> {
    const url = `https://api.trakt.tv/users/${this.userId}/favorites/shows?extended=full`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": this.clientId,
      }
    })

    if (!res.ok) throw new Error(`Trakt.tv API Error: ${res.status}`);

    const json = (await res.json()) as TraktShowListItem[]

    return json;
  }

  async fetchWatchlistShows(): Promise<TraktShowListItem[]> {
    const url = `https://api.trakt.tv/users/${this.userId}/watchlist/shows?extended=full`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": this.clientId,
      }
    });

    if (!res.ok) throw new Error(`Trakt.tv API Error: ${res.status}`);

    const json = (await res.json()) as TraktShowListItem[]

    return json;
  }
}