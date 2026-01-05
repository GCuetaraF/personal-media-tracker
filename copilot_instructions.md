# Media Tracking Domain – Copilot Guidance

This document is meant to be used as **context for GitHub Copilot / AI code completion** while building this application.

The goal of the system is to **collect media data from external sources (starting with Steam)**, normalize it into a **stable domain model**, and persist it in **Postgres (Supabase)**. Rendering (Eleventy) is downstream and not part of this core service.

---

## 1. Core architectural principles

These rules are _intentional_ and should be followed consistently.

### 1.1 Layered architecture

```
External APIs (Steam, YouTube, etc)
        ↓
Clients (HTTP, auth, pagination)
        ↓
Normalizers (shape + unit conversion)
        ↓
Domain services (business flow)
        ↓
Repositories (persistence + invariants)
        ↓
Postgres (Supabase)
```

### 1.2 Strict responsibility boundaries

- **Clients** fetch raw data only
- **Normalizers** translate external data → domain-shaped data
- **Domain services / syncs** orchestrate flows
- **Repositories** are the _only_ place that touches SQL
- **Domain never imports infra code**

---

## 2. Domain concepts

### 2.1 Entity

An `Entity` is the canonical representation of a media item.

Examples:

- Game
- Episode
- Movie
- Song

Properties:

- `kind` (e.g. `game`, `episode`)
- `title`

Entities are **source-agnostic**.

---

### 2.2 Source identity

External services (Steam, YouTube, etc.) map to entities via **source identities**.

Rules:

- One entity can have many source identities
- `(source, external_id)` is globally unique

---

### 2.3 Capabilities (separate tables)

Capabilities are optional and orthogonal.

- `entity_metadata` – descriptive JSON data
- `trackable_state` – status / progress
- `time_state` – accumulated time

Capabilities:

- Are **1:1 with entity**
- Exist only when relevant

---

## 3. Postgres mental model (important)

Tables (simplified):

```
entities
source_identities
entity_metadata
trackable_state
time_state
relationships
source_syncs
```

Each table represents a **domain concept**, not an implementation detail.

---

## 4. Steam integration (vertical slice)

### 4.1 SteamClient

Purpose:

- Handle HTTP
- Handle API keys
- Handle pagination

Rules:

- Returns raw Steam-shaped data
- No domain logic
- No database access

Example responsibility:

- `fetchOwnedGames(): SteamGame[]`

---

### 4.2 SteamNormalizer

Purpose:

- Convert Steam data into a **domain-shaped object**

Rules:

- Convert units (minutes → seconds)
- Rename fields
- Infer simple facts (platform = PC)
- Never persist data

Produces:

- `SteamNormalizedGame`

---

### 4.3 Normalized domain shape (example)

```ts
interface SteamNormalizedGame {
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
```

This shape is the **contract between external sources and the domain**.

---

## 5. Repository interfaces (domain-facing)

Repositories express **domain intent**, not tables.

### 5.1 EntityRepository

```ts
getOrCreateFromSource({
  kind,
  title,
  source,
  externalId
}) → { entityId }
```

Guarantees:

- No duplicate entities
- Source identity is always created

---

### 5.2 MetadataRepository

```ts
upsert(entityId, metadata);
```

Rules:

- Replace semantics (not merge)
- JSONB storage

---

### 5.3 TimeRepository

```ts
recordTotalTime({ entityId, totalSeconds });
```

Rules:

- Time must never decrease
- Monotonic accumulation

---

## 6. Sync orchestration

Sync services:

- Coordinate clients
- Normalize data
- Call repositories
- Record sync results

They:

- Do not contain SQL
- Do not know table schemas
- Are reusable across sources

---

## 7. Source sync bookkeeping

Each sync run should:

- Create a `source_syncs` row
- Mark success / failure
- Store basic stats

Purpose:

- Observability
- Debugging
- Retry safety

---

## 8. Testing philosophy (for future use)

(Not required immediately, but architecture supports it.)

- Normalizers → unit tests
- Repositories → integration tests
- Syncs → minimal happy-path tests

---

## 9. Non-goals (important)

This system intentionally does **not**:

- Render HTML
- Serve public APIs
- Perform real-time sync
- Track per-session analytics

It is a **domain ingestion service**.

---

## 10. Guiding rules for Copilot usage

When generating code, prefer:

- Explicit types over generics
- Clear naming over clever abstractions
- SQL that enforces invariants
- Composition over inheritance

Avoid:

- Generic repositories
- ORMs
- Leaking SQL into domain code
- Mixing external API logic with domain logic

---

## 11. Design mantra (remember this)

> Fetch raw → Normalize early → Enforce invariants → Persist simply

If a piece of code violates this flow, it likely belongs somewhere else.
