import { describe, expect, it } from "vitest";

import { assertValidRelationship } from "./invariants";

describe("assertValidRelationship", () => {
  it("allows valid parent-child relationships", () => {
    expect(() => assertValidRelationship("show", "season", "HAS_SEASON")).not.toThrow();
    expect(() => assertValidRelationship("season", "episode", "HAS_EPISODE")).not.toThrow();
    expect(() => assertValidRelationship("game", "achievement", "HAS_ACHIEVEMENT")).not.toThrow();
    expect(() => assertValidRelationship("album", "song", "HAS_TRACK")).not.toThrow();
    expect(() => assertValidRelationship("subscription", "video", "HAS_SUBSCRIPTION")).not.toThrow();
    expect(() => assertValidRelationship("playlist", "video", "HAS_PLAYLIST")).not.toThrow();
  });

  it("rejects invalid relationship parents", () => {
    expect(() => assertValidRelationship("movie", "season", "HAS_SEASON")).toThrow("Only shows can have seasons");
    expect(() => assertValidRelationship("show", "episode", "HAS_EPISODE")).toThrow("Only seasons can have episodes");
    expect(() => assertValidRelationship("movie", "achievement", "HAS_ACHIEVEMENT")).toThrow("Only games can have achievements");
  });

  it("rejects invalid relationship children", () => {
    expect(() => assertValidRelationship("show", "episode", "HAS_SEASON")).toThrow("Only seasons can be children of HAS_SEASON");
    expect(() => assertValidRelationship("season", "movie", "HAS_EPISODE")).toThrow("Only episodes can be children of HAS_EPISODE");
    expect(() => assertValidRelationship("album", "movie", "HAS_TRACK")).toThrow("Only songs can be children of HAS_TRACK");
  });
});
