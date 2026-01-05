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
        retroachievements_game_id: data.GameID,
        retroachievements_console_id: data.ConsoleID,
        achievements_unlocked: data.NumAwarded,
        achievements_total: data.MaxPossible,
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
        retroachievements_achievement_id: data.AchievementID,
        retroachievements_game_id: data.GameID,
        retroachievements_game_title: data.GameTitle,
        retroachievements_points: data.Points,
        retroachievements_date_unlocked: data.Date,
      },
    };
  }
}
