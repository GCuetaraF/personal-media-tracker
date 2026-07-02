import { describe, expect, it } from "vitest";

import { isTimeBased, isTrackable } from "./invariants";

describe("capability invariants", () => {
  it("marks playable/watchable/listenable media as trackable", () => {
    expect(isTrackable("game")).toBe(true);
    expect(isTrackable("episode")).toBe(true);
    expect(isTrackable("movie")).toBe(true);
    expect(isTrackable("song")).toBe(true);
  });

  it("does not mark container entities as trackable", () => {
    expect(isTrackable("show")).toBe(false);
    expect(isTrackable("season")).toBe(false);
    expect(isTrackable("album")).toBe(false);
    expect(isTrackable("playlist")).toBe(false);
  });

  it("uses the same entity set for time-based tracking", () => {
    expect(isTimeBased("game")).toBe(true);
    expect(isTimeBased("show")).toBe(false);
  });
});
