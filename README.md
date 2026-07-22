# Personal Media Tracker

Unified tracker for games, videos, shows, and manga. Syncs from multiple platforms into one database.

## Supported Platforms

🎮 Steam • RetroAchievements
📺 YouTube • Twitch • Trakt
📚 MangaDex • FreshRSS • Pagebound

## Tech Stack

TypeScript • Node.js • Supabase • Vitest • Zod

## Quick Start

```bash
git clone <repository-url>
cd personal-media-tracker
npm install
```

Create `.env`:
```env
SUPABASE_URL=your_url
SUPABASE_KEY=your_key

# Add API keys for sources you want to sync
STEAM_API_KEY=...
RETROACHIEVEMENTS_API_KEY=...
```

Set up Supabase tables (see `src/docs/` for schema)

## Commands

```bash
npm run dev    # Development
npm run build  # Production build
npm test       # Run tests
```

## Documentation

See `src/docs/` for domain model and architecture details.

## License

ISC