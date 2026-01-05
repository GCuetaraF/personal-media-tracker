import type { EntityKind } from "../entity/EntityKind";

export function assertValidRelationship(
  parentKind: EntityKind,
  childKind: EntityKind,
  type: string,
) {
  if (type === "HAS_SEASON" && parentKind !== "show") {
    throw new Error("Only shows can have seasons");
  }

  if (type === "HAS_EPISODE" && parentKind !== "season") {
    throw new Error("Only seasons can have episodes");
  }

  if (type === "HAS_ACHIEVEMENT" && parentKind !== "game") {
    throw new Error("Only games can have achievements");
  }

  if (type === "HAS_TRACK" && parentKind !== "album") {
    throw new Error("Only albums can have tracks");
  }
}
