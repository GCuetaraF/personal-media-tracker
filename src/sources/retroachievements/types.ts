export interface RetroachievementsGameProgress {
  GameID: number;
  Title: string;
  ImageIcon: string;
  ConsoleID: number;
  ConsoleName: string;
  MaxPossible: number;
  NumAwarded: number;
  NumAwardedHardcore: number;
  MostRecentAwardedDate: string;
  HighestAwardKind: string;
  HighestAwardDate: string;
}

export interface RetroachievementsGameProgressResponse {
  Count: number;
  Total: number;
  Results: RetroachievementsGameProgress[];
}

export interface RetroachievementsAchievement {
  Date: string;
  HardcoreMode: number;
  AchievementID: number;
  Title: string;
  Description: string;
  BadgeName: string;
  Points: number;
  TrueRatio: number;
  Type: string;
  Author: string;
  AuthorULID: string;
  GameTitle: string;
  GameIcon: string;
  GameID: number;
  ConsoleName: string;
  CumulScore: number;
  BadgeURL: string;
  GameURL: string;
}

export interface RetroachievementsNormalizedGame {
  kind: "game";
  title: string;

  source: "retroachievements";
  externalId: string;

  metadata: {
    platforms: string[];
    retroachievements_game_id: number;
    retroachievements_console_id: number;
    achievements_unlocked: number;
    achievements_total: number;
  };

  timeSeconds?: number;
}

export interface RetroachievementsUnlocksByDateRange {
  Date: string;
  HardcoreMode: number;
  AchievementID: number;
  Title: string;
  Description: string;
  BadgeName: string;
  Points: number;
  TrueRatio: number;
  Type: string;
  Author: string;
  AuthorULID: string;
  GameTitle: string;
  GameIcon: string;
  GameID: number;
  ConsoleName: string;
  CumulScore: number;
  BadgeURL: string;
  GameURL: string;
}

export interface RetroachievementsNormalizedAchiement {
  kind: "achievement";
  title: string;

  source: "retroachievements";
  externalId: string;

  metadata: {
    retroachievements_achievement_id: number;
    retroachievements_game_id: number;
    retroachievements_game_title: string;
    retroachievements_points: number;
    retroachievements_date_unlocked: string;
  };

}
