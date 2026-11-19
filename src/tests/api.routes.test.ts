import type Database from "better-sqlite3";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET as getFeed } from "@/app/api/feed/route";
import { GET as getMatches } from "@/app/api/matches/route";
import { POST as postSwipe } from "@/app/api/swipe/route";
import { createTestDb } from "@/server/testing/createTestDb";

const holder = vi.hoisted(() => ({ db: null as unknown as Database.Database }));
vi.mock("@/server/db/connection", () => ({ getDb: () => holder.db }));

beforeEach(() => {
  holder.db = createTestDb();
});

const swipeRequest = (body: unknown) =>
  new Request("http://localhost/api/swipe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("GET /api/feed", () => {
  it("returns 30 profiles with no like-related fields", async () => {
    const res = await getFeed();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.count).toBe(30);
    expect(Object.keys(body.profiles[0]).sort()).toEqual(
      ["age", "bio", "city", "id", "interests", "name", "photo_url"]
    );
  });
});

describe("POST /api/swipe", () => {
  it("returns matched=true with the profile when the like is mutual", async () => {
    const res = await postSwipe(swipeRequest({ profileId: "profile-001", action: "like" }));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.matched).toBe(true);
    expect(body.match.id).toBe("profile-001");
  });

  it("returns matched=false and no profile for a one-sided like", async () => {
    const res = await postSwipe(swipeRequest({ profileId: "profile-002", action: "like" }));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.matched).toBe(false);
    expect(body).not.toHaveProperty("match");
  });

  it("returns 200 and alreadySwiped on a repeat swipe", async () => {
    await postSwipe(swipeRequest({ profileId: "profile-001", action: "like" }));
    const res = await postSwipe(swipeRequest({ profileId: "profile-001", action: "like" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.alreadySwiped).toBe(true);
    expect(body.matched).toBe(true);
  });

  it("rejects an invalid action, malformed JSON and unknown profiles", async () => {
    const badAction = await postSwipe(swipeRequest({ profileId: "profile-001", action: "superlike" }));
    const badJson = await postSwipe(swipeRequest("{not json"));
    const unknown = await postSwipe(swipeRequest({ profileId: "profile-999", action: "like" }));

    expect(badAction.status).toBe(400);
    expect(badJson.status).toBe(400);
    expect(unknown.status).toBe(404);
  });
});

describe("GET /api/matches", () => {
  it("lists only mutual matches", async () => {
    await postSwipe(swipeRequest({ profileId: "profile-001", action: "like" }));
    await postSwipe(swipeRequest({ profileId: "profile-002", action: "like" }));

    const body = await (await getMatches()).json();
    expect(body.count).toBe(1);
    expect(body.matches[0].id).toBe("profile-001");
  });
});

vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  connection: async () => {},
}));