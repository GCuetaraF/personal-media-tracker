import type { EntityKind } from "../entity/EntityKind";

export function isTrackable(kind: EntityKind): boolean {
  return ["game", "episode", "movie", "song"].includes(kind);
}

export function isTimeBased(kind: EntityKind): boolean {
  return ["game", "episode", "movie", "song"].includes(kind);
}
