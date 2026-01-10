import type { SteamGame, SteamNormalizedAchievement, SteamNormalizedGame, SteamUserAchievementWithMetadata } from "./types";

export class SteamNormalizer {
  normalizeGame(game: SteamGame): SteamNormalizedGame {
    return {
      kind: "game",
      title: game.name,

      source: "steam",
      externalId: String(game.appid),

      metadata: {
        platforms: ["PC"],
        steam_appid: game.appid,
        icons: {
          "32x32": game.img_icon_url
            ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
            : null,
          "184x69": `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/capsule_184x69.jpg`,
        },
        lastPlayed: game.rtime_last_played ? new Date(game.rtime_last_played * 1000).toISOString() : null,
      },

      timeSeconds: game.playtime_forever * 60,
    };
  }

  normalizeAchievement(achievement: SteamUserAchievementWithMetadata): SteamNormalizedAchievement {
    return {
      kind: "achievement",
      title: achievement.displayName,

      source: "steam",
      externalId: String(achievement.apiname),

      metadata: {
        description: achievement.description,
        icon: achievement.icon,
        dateUnlocked: achievement.unlocktime ?? null,
      },

    };
  }
}
