export interface SteamOwnedGamesResponse {
  response: {
    game_count: number;
    games: SteamGame[];
  };
}

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number; // minutes
  playtime_2weeks?: number;
  img_icon_url?: string;
  img_logo_url?: string;
  has_community_visible_stats?: boolean;
}

export interface SteamNormalizedGame {
  kind: "game";
  title: string;

  source: "steam";
  externalId: string;

  metadata: {
    platforms: string[];
    steam_appid: number;
  };

  timeSeconds: number;
}
