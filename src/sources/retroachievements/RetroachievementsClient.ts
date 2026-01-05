import type { RetroachievementsAchievement, RetroachievementsGameProgress, RetroachievementsGameProgressResponse } from "./types";

export class RetroachievementsClient {
  constructor(private apiKey: string, private userId: string) { }

  async fetchGameProgress(): Promise<RetroachievementsGameProgress[]> {
    const url = "https://retroachievements.org/API/API_GetUserCompletionProgress.php";

    const params = new URLSearchParams({
      u: this.userId,
      y: this.apiKey,
    });

    const res = await fetch(`${url}?${params}`);

    if (!res.ok)
      throw new Error(`Retroachievements API Error: ${res.status}`);

    const json = (await res.json()) as RetroachievementsGameProgressResponse;

    return json.Results ?? [];
  }

  async fetchAchievementsBetween(startDate?: string, endDate?: string): Promise<RetroachievementsAchievement[]> {
    const url = "https://retroachievements.org/API/API_GetAchievementsEarnedBetween.php";

    const params = new URLSearchParams({
      u: this.userId,
      y: this.apiKey,
    });

    if (startDate)
      params.append("f", startDate);

    if (endDate)
      params.append("t", endDate);

    const res = await fetch(`${url}?${params}`);

    if (!res.ok)
      throw new Error(`Retroachievements API Error: ${res.status}`);

    const json = (await res.json()) as RetroachievementsAchievement[];

    return json ?? [];
  }
}
