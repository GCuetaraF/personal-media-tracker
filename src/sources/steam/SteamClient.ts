import type { SteamGame, SteamOwnedGamesResponse } from "./types";

export class SteamClient {
  constructor(
    private apiKey: string,
    private steamId: string,
  ) {}

  async fetchOwnedGames(): Promise<SteamGame[]> {
    const url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";

    const params = new URLSearchParams({
      key: this.apiKey,
      steamid: this.steamId,
      include_appinfo: "true",
    });

    const res = await fetch(`${url}?${params}`);

    if (!res.ok) 
      throw new Error(`Steam API error: ${res.status}`);

    const json = (await res.json()) as SteamOwnedGamesResponse;

    return json.response.games ?? [];
  }
}
