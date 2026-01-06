import { env } from "@/config/env";
import { db } from "@/db/supabase";
import { RetroachievementsClient } from "@/sources/retroachievements/RetroachievementsClient";
import { RetroachievementsNormalizer } from "@/sources/retroachievements/RetroachievementsNormalizer";
import { RetroachievementsSync } from "@/sources/retroachievements/RetroachievementsSync";
import { SteamClient } from "@/sources/steam/SteamClient";
import { SteamNormalizer } from "@/sources/steam/SteamNormalizer";

import { EntityRepository } from "../repositories/EntityRepository";
import { MetadataRepository } from "../repositories/MetadataRepository";
import { RelationshipRepository } from "../repositories/RelationshipRepository";
import { SourceSyncRepository } from "../repositories/SourceSyncRepository";
import { TimeRepository } from "../repositories/TimeRepository";
import { SteamSync } from "../sources/steam/SteamSync";

export const syncRegistry: Record<string, () => Promise<{ run: () => Promise<void> }>> = {
  steam: async () => {
    const apiKey = env.STEAM_API_KEY;
    const steamId = ""; // env.STEAM_ID;

    if (!apiKey || !steamId) {
      throw new Error("Missing STEAM_API_KEY or STEAM_ID in .env");
    }
    const client = new SteamClient(apiKey, steamId);
    const normalizer = new SteamNormalizer();
    const entities = new EntityRepository(db);
    const metadata = new MetadataRepository(db);
    const time = new TimeRepository(db);
    const syncs = new SourceSyncRepository(db);

    return new SteamSync(client, normalizer, entities, metadata, time, syncs);
  },
  retroachievements: async () => {
    const apiKey = env.RETROACHIEVEMENTS_API_KEY;
    const userId = env.RETROACHIEVEMENTS_USER_ID;

    if (!apiKey || !userId) {
      throw new Error("Missing RETROACHIEVEMENTS_API_KEY or RETROACHIEVEMENTS_USER_ID in .env");
    }
    const client = new RetroachievementsClient(apiKey, userId);
    const normalizer = new RetroachievementsNormalizer();
    const entities = new EntityRepository(db);
    const metadata = new MetadataRepository(db);
    const relationships = new RelationshipRepository(db);
    const syncs = new SourceSyncRepository(db);

    return new RetroachievementsSync(client, normalizer, entities, metadata, relationships, syncs);
  },
};
