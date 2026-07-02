import { describe, expect, it } from "vitest";

import { SteamNormalizer } from "./SteamNormalizer";

describe("steam normalizer", () => {
  const normalizer = new SteamNormalizer();

  it("normalizes owned games into canonical game entities", () => {
    const result = normalizer.normalizeGame({
      appid: 620,
      name: "Portal 2",
      playtime_forever: 123,
      img_icon_url: "iconhash",
      rtime_last_played: 1_700_000_000,
    });

    expect(result).toEqual({
      kind: "game",
      title: "Portal 2",
      source: "steam",
      externalId: "620",
      metadata: {
        platforms: ["PC"],
        steam_appid: 620,
        icons: {
          "32x32": "https://media.steampowered.com/steamcommunity/public/images/apps/620/iconhash.jpg",
          "184x69": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/capsule_184x69.jpg",
        },
        lastPlayed: "2023-11-14T22:13:20.000Z",
      },
      timeSeconds: 7380,
    });
  });

  it("uses null for optional game metadata that Steam omits", () => {
    const result = normalizer.normalizeGame({
      appid: 400,
      name: "Portal",
      playtime_forever: 0,
    });

    expect(result.metadata.icons["32x32"]).toBeNull();
    expect(result.metadata.lastPlayed).toBeNull();
    expect(result.timeSeconds).toBe(0);
  });

  it("normalizes unlocked achievements", () => {
    const result = normalizer.normalizeAchievement({
      apiname: "ACH_WIN",
      achieved: 1,
      unlocktime: 1_700_000_001,
      displayName: "Victory",
      description: "Finish the thing",
      icon: "https://example.test/icon.png",
      iconGray: null,
      hidden: false,
    });

    expect(result).toEqual({
      kind: "achievement",
      title: "Victory",
      source: "steam",
      externalId: "ACH_WIN",
      metadata: {
        description: "Finish the thing",
        icon: "https://example.test/icon.png",
        dateUnlocked: 1_700_000_001,
      },
    });
  });
});
