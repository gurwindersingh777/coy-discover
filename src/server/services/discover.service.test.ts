import type Database from "better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import { mockProfiles } from "../seed/profiles";
import { createTestDb } from "../testing/createTestDb";
import { getFeed, getMatches, swipe } from "./discover.service";
import { CURRENT_USER_ID } from "../config/config";

const LIKER = "profile-001"; // seeded: already liked the demo user
const OTHER_LIKER = "profile-004"; // seeded: already liked the demo user
const NON_LIKER = "profile-002"; // seeded: has NOT liked the demo user

let db: Database.Database;

beforeEach(() => {
  db = createTestDb();
});

describe("getFeed", () => {
  it("returns every seeded profile and never the demo user", () => {
    const feed = getFeed(db, CURRENT_USER_ID);
    expect(feed).toHaveLength(mockProfiles.length);
    expect(feed.map((p) => p.id)).not.toContain(CURRENT_USER_ID);
  });

  it("exposes only profile fields, nothing about likes (privacy)", () => {
    const [first] = getFeed(db, CURRENT_USER_ID);
    expect(Object.keys(first).sort()).toEqual(
      ["age", "bio", "city", "id", "interests", "name", "photo_url"]
    );
  });

  it("does not order profiles that liked the user ahead of the others (privacy)", () => {
    const ids = getFeed(db, CURRENT_USER_ID).map((p) => p.id);
    expect(ids).toEqual([...ids].sort());
  });

  it("never returns a profile again after it was swiped", () => {
    swipe(db, CURRENT_USER_ID, NON_LIKER, "pass");
    const ids = getFeed(db, CURRENT_USER_ID).map((p) => p.id);
    expect(ids).toHaveLength(mockProfiles.length - 1);
    expect(ids).not.toContain(NON_LIKER);
  });
});

describe("swipe", () => {
  it("creates a match when the profile already liked the user", () => {
    const result = swipe(db, CURRENT_USER_ID, LIKER, "like");
    expect(result).toMatchObject({ status: "created", match: { id: LIKER } });
  });

  it("does not create a match for a one-sided like", () => {
    const result = swipe(db, CURRENT_USER_ID, NON_LIKER, "like");
    expect(result).toEqual({ status: "created", match: null });
    expect(getMatches(db, CURRENT_USER_ID)).toHaveLength(0);
  });

  it("does not create a match when the user passes on someone who liked them", () => {
    const result = swipe(db, CURRENT_USER_ID, LIKER, "pass");
    expect(result).toEqual({ status: "created", match: null });
    expect(getMatches(db, CURRENT_USER_ID)).toHaveLength(0);
  });

  it("is idempotent: repeating a swipe returns the same match and adds no duplicate", () => {
    swipe(db, CURRENT_USER_ID, LIKER, "like");
    const again = swipe(db, CURRENT_USER_ID, LIKER, "like");
    expect(again).toMatchObject({ status: "already_swiped", match: { id: LIKER } });
    expect(getMatches(db, CURRENT_USER_ID)).toHaveLength(1);
  });

  it("never turns a pass into a like later", () => {
    swipe(db, CURRENT_USER_ID, LIKER, "pass");
    const again = swipe(db, CURRENT_USER_ID, LIKER, "like");
    expect(again).toEqual({ status: "already_swiped", match: null });
    expect(getMatches(db, CURRENT_USER_ID)).toHaveLength(0);
  });

  it("rejects unknown profiles and the demo user itself", () => {
    expect(swipe(db, CURRENT_USER_ID, "profile-999", "like")).toEqual({ status: "profile_not_found" });
    expect(swipe(db, CURRENT_USER_ID, CURRENT_USER_ID, "like")).toEqual({ status: "profile_not_found" });
  });
});

describe("getMatches", () => {
  it("lists only mutual matches, newest first", () => {
    swipe(db, CURRENT_USER_ID, LIKER, "like");
    swipe(db, CURRENT_USER_ID, NON_LIKER, "like"); 
    swipe(db, CURRENT_USER_ID, OTHER_LIKER, "like");

    const ids = getMatches(db, CURRENT_USER_ID).map((m) => m.id);
    expect(ids).toEqual([OTHER_LIKER, LIKER]);
  });
});