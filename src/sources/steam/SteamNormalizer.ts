import type { SteamGame, SteamNormalizedGame } from "./types";

export class SteamNormalizer {
  normalize(game: SteamGame): SteamNormalizedGame {
    return {
      kind: "game",
      title: game.name,

      source: "steam",
      externalId: String(game.appid),

      metadata: {
        platforms: ["PC"],
        steam_appid: game.appid,
      },

      timeSeconds: game.playtime_forever * 60,
    };
  }
}
