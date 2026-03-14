import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env.local" });

// eslint-disable-next-line no-console
console.log("🔐 Loading environment variables...");

const serverSchema = z.object({
  // Supabase
  SUPABASE_URL: z.string().min(1),
  SUPABASE_SERVICE_ROLE: z.string().min(1),

  // YOUTUBE
  YOUTUBE_PLAYLIST_ID: z.string().min(1),
  YOUTUBE_CLIENT_ID: z.string().min(1),
  YOUTUBE_API_KEY: z.string().min(1),
  YOUTUBE_CLIENT_SECRET: z.string().min(1),
  YOUTUBE_REFRESH_TOKEN: z.string().min(1),

  // RETROACHIEVEMENTS
  RETROACHIEVEMENTS_API_KEY: z.string().min(1).optional(),
  RETROACHIEVEMENTS_USER_ID: z.string().min(1).optional(),

  // TRAKT
  TRAKT_CLIENT_ID: z.string().min(1).optional(),
  TRAKT_USER_ID: z.string().min(1).optional(),
  // // HLTB
  // HLTB_USER: z.string().min(1),
  // HLTB_USER_ID: z.string().min(1),

  // MANGADEX
  // MANGADEX_FOLLOWS_LIST_ID: z.string().min(1),
  MANGADEX_USER_ID: z.string().min(1).optional(),
  MANGADEX_PASSWORD: z.string().min(1).optional(),
  MANGADEX_CLIENT_ID: z.string().min(1).optional(),
  MANGADEX_CLIENT_SECRET: z.string().min(1).optional(),

  // Steam
  STEAM_API_KEY: z.string().min(1).optional(),
  STEAM_ID: z.string().min(1).optional(),

  // SteamGridDB
  STEAMGRIDDB_API_KEY: z.string().min(1).optional(),

});

// eslint-disable-next-line node/no-process-env
const _serverEnv = serverSchema.safeParse(process.env);

if (!_serverEnv.success) {
  console.error("❌ Invalid environment variables:\n");
  _serverEnv.error.issues.forEach((issue) => {
    console.error(issue);
  });
  throw new Error("Invalid environment variables");
}

const {
  // NODE_ENV,
  SUPABASE_SERVICE_ROLE,
  SUPABASE_URL,
  // SUPABASE_KEY,
  // HLTB_USER,
  // HLTB_USER_ID,
  MANGADEX_CLIENT_ID,
  MANGADEX_CLIENT_SECRET,
  MANGADEX_PASSWORD,
  MANGADEX_USER_ID,
  YOUTUBE_API_KEY,
  YOUTUBE_PLAYLIST_ID,
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REFRESH_TOKEN,
  STEAM_API_KEY,
  STEAM_ID,
  STEAMGRIDDB_API_KEY,
  RETROACHIEVEMENTS_API_KEY,
  RETROACHIEVEMENTS_USER_ID,
  TRAKT_CLIENT_ID,
  TRAKT_USER_ID
} = _serverEnv.data;

export const env = {
  // NODE_ENV,
  SUPABASE_SERVICE_ROLE,
  SUPABASE_URL,
  // SUPABASE_KEY,
  // HLTB_USER,
  // HLTB_USER_ID,
  MANGADEX_CLIENT_ID,
  MANGADEX_CLIENT_SECRET,
  MANGADEX_PASSWORD,
  MANGADEX_USER_ID,
  YOUTUBE_PLAYLIST_ID,
  YOUTUBE_API_KEY,
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REFRESH_TOKEN,
  STEAM_API_KEY,
  STEAM_ID,
  STEAMGRIDDB_API_KEY,
  RETROACHIEVEMENTS_API_KEY,
  RETROACHIEVEMENTS_USER_ID,
  TRAKT_CLIENT_ID,
  TRAKT_USER_ID
};
// eslint-disable-next-line no-console
console.log("✅ Environment variables loaded");
