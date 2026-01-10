import type { SteamAchievementSchema, SteamAchievementSchemaResponse, SteamGame, SteamOwnedGamesResponse, SteamPlayerAchievementsResponse, SteamUserAchievementWithMetadata } from "./types";

/**
 * SteamClient provides methods to interact with the Steam Web API for games and achievements.
 */
export class SteamClient {
  /**
   * Create a new SteamClient instance.
   * @param apiKey Your Steam Web API key
   * @param steamId The user's SteamID64
   */
  constructor(
    private apiKey: string,
    private steamId: string,
  ) { }

  /**
   * Fetch the list of games owned by the user.
   * @returns Array of SteamGame objects
   */
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

  /**
   * Fetch the user's achievement status for a specific game.
   * @param appid The Steam App ID of the game
   * @returns Player achievement status for the game, or null if not available
   */
  async fetchUserAchievements(appid: number): Promise<SteamPlayerAchievementsResponse["playerstats"] | null> {
    const url = "https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/";

    const params = new URLSearchParams({
      key: this.apiKey,
      steamid: this.steamId,
      appid: String(appid),
    });

    const res = await fetch(`${url}?${params}`);

    if (!res.ok) {
      console.warn(`Steam API error: ${res.status} for appid ${appid}`);
      return null;
    }

    const json = (await res.json()) as SteamPlayerAchievementsResponse;
    return json.playerstats;
  }

  /**
   * Fetch unlocked achievements for a specific game, joined with schema metadata.
   * Only achievements the user has unlocked are returned.
   * @param appid The Steam App ID of the game
   * @returns Array of SteamUserAchievementWithMetadata objects (unlocked only)
   */
  async fetchUserAchievementsWithMetadata(appid: number): Promise<SteamUserAchievementWithMetadata[]> {
    const [playerstats, schema] = await Promise.all([
      this.fetchUserAchievements(appid),
      this.fetchAchievementSchema(appid),
    ]);

    if (!playerstats || !playerstats.achievements || !Array.isArray(playerstats.achievements))
      return [];

    return playerstats.achievements.filter(a => a.achieved === 1).map((userAch): SteamUserAchievementWithMetadata => {
      const meta = schema.find(s => s.name === userAch.apiname);

      return {
        ...userAch,
        displayName: meta?.displayName ?? userAch.apiname,
        description: meta?.description ?? null,
        icon: meta?.icon ?? null,
        iconGray: meta?.icongray ?? null,
        hidden: meta ? !!meta.hidden : false,
      };
    });
  }

  /**
   * Fetch achievement schema (metadata) for a specific game (appid).
   * @param appid The Steam App ID of the game
   * @returns Array of SteamAchievementSchema objects for the game
   */
  private async fetchAchievementSchema(appid: number): Promise<SteamAchievementSchema[]> {
    const url = "https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/";

    const params = new URLSearchParams({
      key: this.apiKey,
      appid: String(appid),
    });

    const res = await fetch(`${url}?${params}`);

    if (!res.ok)
      throw new Error(`Steam API error: ${res.status}`);

    const json = (await res.json()) as SteamAchievementSchemaResponse;
    return json.game?.availableGameStats?.achievements ?? [];
  }
}
