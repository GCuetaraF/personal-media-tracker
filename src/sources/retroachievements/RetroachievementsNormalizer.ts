import type { RetroachievementsGameProgress, RetroachievementsNormalizedAchiement, RetroachievementsNormalizedGame, RetroachievementsUnlocksByDateRange } from "./types";

export class RetroachievementsNormalizer {
  normalizeGame(data: RetroachievementsGameProgress): RetroachievementsNormalizedGame {
    return {
      kind: "game",
      title: data.Title,

      source: "retroachievements",
      externalId: String(data.GameID),

      metadata: {
        platforms: [data.ConsoleName],
        gameId: data.GameID,
        consoleId: data.ConsoleID,
        achievementsUnlocked: data.NumAwarded,
        achievementsTotal: data.MaxPossible,
        icons: {
          "96x96": data.ImageIcon
            ? `https://media.retroachievements.org/Images/${data.ImageIcon.replace(/^.*[\\/]/, "")}`
            : null,
        },
        lastPlayed: data.MostRecentAwardedDate,
      },
    };
  }

  normalizeAchievement(data: RetroachievementsUnlocksByDateRange): RetroachievementsNormalizedAchiement {
    return {
      kind: "achievement",
      title: data.Title,

      source: "retroachievements",
      externalId: String(data.AchievementID),

      metadata: {
        achievementId: data.AchievementID,
        gameId: data.GameID,
        gameTitle: data.GameTitle,
        points: data.Points,
        dateUnlocked: data.Date,
        icon: data.BadgeURL
          ? `https://media.retroachievements.org/Badge/${data.BadgeURL.replace(/^.*[\\/]/, "")}`
          : null,
      },
    };
  }
}
