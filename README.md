# Personal Media Tracker

Track all your media consumption in one place. Syncs games, videos, shows, and manga from multiple platforms into a unified database.

## What it does

Instead of checking Steam, YouTube, Trakt, and MangaDex separately, this app automatically syncs everything into one centralized tracker. Built with TypeScript and Supabase.

## Features

- Sync from multiple platforms automatically
- Track progress and time spent across all media
- Unified view of games, shows, videos, and manga
- Clean domain-driven architecture

## Supported Platforms

- 🎮 **Gaming**: Steam, RetroAchievements
- 📺 **Video**: YouTube, Twitch, Trakt
- 📚 **Reading**: MangaDex, FreshRSS

## Architecture

### Core Concepts

1. **Entities**: Everything trackable is an entity (games, shows, episodes, achievements, etc.)
2. **Entity Kinds**: Semantic types that define what an entity represents (`game`, `show`, `episode`, `achievement`, etc.)
3. **Relationships**: Parent-child links between entities (e.g., `HAS_SEASON`, `HAS_ACHIEVEMENT`)
4. **Capabilities**: Behaviors that entities can have:
   - `Trackable`: Progress and completion tracking
   Tech Stack

- TypeScript + Node.js
- Supabase (PostgreSQL)
- tsup, esbuild
- Vitest, ESLint, ZodionshipType, invariants
├── repositories/        # Data access layer
│   ├── EntityRepository.ts
│   ├── MetadataRepository.ts
│   ├── RelationshipRepository.ts
│   ├── SourceSyncRepository.ts
│   ├── TimeRepository.ts
│   └── TrackableRepository.ts
├── sources/            # External source integrations
│   ├── steam/         # Steam API client, normalizer, sync
│   ├── retroachievements/
│   ├── youtube/
│   ├── trakt/
│   ├── mangadex/
│   ├── freshrss/
│   └── twitch/
├── sync/              # Sync orchestration
│   └── SyncRegistry.ts
├── db/                # Database configuration
│   ├── supabase.ts
│   └── types.ts
└── config/            # Configuration
    └── env.ts
```

## Setup

### Prerequisites

- Node.js 18+ (or latest LTS)
- A Supabase project
- API keys for the sources you want to sync

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-media-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
1. Clone and install:
```bash
git clone <repository-url>
cd personal-media-tracker
npm install
```

2. Create a `.env` file
# FreshRSS (optional)
FRESHRSS_URL=your_freshrss_url
FRESHRSS_API_KEY=your_freshrss_api_key
```

4. Set up your Supabase database schema:
   - Create tables for `entities`, `source_identities`, `relationships`, `entity_metadata`, `trackable_state`, `time_tracking`, and `source_syncs`
   - Refer to the documentation in `src/docs/` for schema details

### Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build
3. Set up your Supabase database (see `src/docs/` for schema)

 Lint code
npm run lint

# Run tests
npm test
npm run dev    # Development with hot reload
npm run build  # Build for production
npm start      # Run production build
npm test       # Run tests
```