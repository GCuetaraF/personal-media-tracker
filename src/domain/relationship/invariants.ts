import type { EntityKind } from "../entity/EntityKind";

export function assertValidRelationship(
  parentKind: EntityKind,
  childKind: EntityKind,
  type: string,
) {
  if (type === "HAS_SEASON") {
    if (parentKind !== "show") {
      throw new Error("Only shows can have seasons");
    }
    if (childKind !== "season") {
      throw new Error("Only seasons can be children of HAS_SEASON");
    }
  }

  if (type === "HAS_EPISODE") {
    if (parentKind !== "season") {
      throw new Error("Only seasons can have episodes");
    }
    if (childKind !== "episode") {
      throw new Error("Only episodes can be children of HAS_EPISODE");
    }
  }

  if (type === "HAS_ACHIEVEMENT") {
    if (parentKind !== "game") {
      throw new Error("Only games can have achievements");
    }
    if (childKind !== "achievement") {
      throw new Error("Only achievements can be children of HAS_ACHIEVEMENT");
    }
  }

  if (type === "HAS_TRACK") {
    if (parentKind !== "album") {
      throw new Error("Only albums can have tracks");
    }
    if (childKind !== "song") {
      throw new Error("Only songs can be children of HAS_TRACK");
    }
  }

  if (type === "HAS_SUBSCRIPTION") {
    if (parentKind !== "subscription") {
      throw new Error("Only subscriptions can be parents in HAS_SUBSCRIPTION");
    }
    if (childKind !== "video" && childKind !== "playlist") {
      throw new Error("Only videos or playlists can be children of HAS_SUBSCRIPTION");
    }
  }

  if (type === "HAS_PLAYLIST") {
    if (parentKind !== "playlist") {
      throw new Error("Only playlists can be parents in HAS_PLAYLIST");
    }
    if (childKind !== "video") {
      throw new Error("Only videos can be children of HAS_PLAYLIST");
    }
  }
}
