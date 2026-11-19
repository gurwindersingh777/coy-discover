import type Database from "better-sqlite3";
import type { Match, Profile, SwipeAction } from "@/types/discover";

type Db = Database.Database;

interface ProfileRow {
  id: string;
  name: string;
  age: number;
  photo_url: string;
  bio: string;
  city: string;
  interests: string;
}

export type SwipeResult =
  | { status: "profile_not_found" }
  | { status: "created" | "already_swiped"; match: Profile | null };

const PROFILE_COLUMNS = `
  u.id, u.name, u.age, u.photo_url,
  u.bio, u.city, u.interests
`;

function toProfile(row: ProfileRow): Profile {
  return { ...row, interests: JSON.parse(row.interests) as string[] };
}

function getProfile(db: Db, profileId: string): Profile | null {
  const row = db
    .prepare(`SELECT ${PROFILE_COLUMNS} FROM users u WHERE u.id = ?`)
    .get(profileId) as ProfileRow | undefined;

  return row ? toProfile(row) : null;
}

function getMutualMatch(db: Db, userId: string, profileId: string): Profile | null {
  const [one, two] = [userId, profileId].sort();

  const match = db
    .prepare(`
      SELECT 1 FROM matches
      WHERE user_one_id = ? AND user_two_id = ?
    `)
    .get(one, two);

  return match ? getProfile(db, profileId) : null;
}

export function getFeed(db: Db, userId: string): Profile[] {
  const rows = db
    .prepare(`
      SELECT ${PROFILE_COLUMNS}
      FROM users u
      WHERE u.id != ?
        AND u.is_demo_user = 0
        AND NOT EXISTS (
          SELECT 1
          FROM swipes s
          WHERE s.from_user_id = ?
            AND s.to_user_id = u.id
        )
      ORDER BY u.id ASC
    `)
    .all(userId, userId) as ProfileRow[];

  return rows.map(toProfile);
}

export function swipe(db: Db, userId: string, profileId: string, action: SwipeAction): SwipeResult {
  return db.transaction((): SwipeResult => {
    const profile = db
      .prepare(`
        SELECT id FROM users
        WHERE id = ? AND is_demo_user = 0
      `)
      .get(profileId);

    if (!profile) {
      return { status: "profile_not_found" };
    }

    const existingSwipe = db
      .prepare(`
        SELECT 1 FROM swipes
        WHERE from_user_id = ? AND to_user_id = ?
      `)
      .get(userId, profileId);

    if (existingSwipe) {
      return {
        status: "already_swiped",
        match: getMutualMatch(db, userId, profileId),
      };
    }

    db.prepare(`
      INSERT INTO swipes (from_user_id, to_user_id, action)
      VALUES (?, ?, ?)
    `).run(userId, profileId, action);

    if (action === "pass") {
      return { status: "created", match: null };
    }

    const mutualLike = db
      .prepare(`
        SELECT 1 FROM swipes
        WHERE from_user_id = ?
          AND to_user_id = ?
          AND action = 'like'
      `)
      .get(profileId, userId);

    if (!mutualLike) {
      return { status: "created", match: null };
    }

    const [one, two] = [userId, profileId].sort();

    db.prepare(`
      INSERT OR IGNORE INTO matches (user_one_id, user_two_id)
      VALUES (?, ?)
    `).run(one, two);

    return { status: "created", match: getProfile(db, profileId) };
  })();
}

export function getMatches(db: Db, userId: string): Match[] {
  const rows = db
    .prepare(`
      SELECT ${PROFILE_COLUMNS}, m.created_at AS matched_at
      FROM matches m
      JOIN users u
        ON u.id = CASE
          WHEN m.user_one_id = ? THEN m.user_two_id
          ELSE m.user_one_id
        END
      WHERE m.user_one_id = ? OR m.user_two_id = ?
      ORDER BY m.created_at DESC, m.id DESC
    `)
    .all(userId, userId, userId) as (ProfileRow & {
      matched_at: string;
    })[];

  return rows.map((row) => ({ ...toProfile(row), matched_at: row.matched_at }));
}
