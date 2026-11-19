import Database from "better-sqlite3";
import { CURRENT_USER_ID } from "../config/config";
import { mockProfiles } from "../seed/profiles";


export const PROFILES_WHO_LIKED_DEMO_USER = [
  "profile-001",
  "profile-004",
  "profile-007",
  "profile-011",
  "profile-016",
];

export function seedDatabase(db: Database.Database) {
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, age, photo_url, bio, city, interests, is_demo_user)
    VALUES (@id, @name, @age, @photo_url, @bio, @city, @interests, @is_demo_user)
  `);

  const insertLike = db.prepare(`
    INSERT OR IGNORE INTO swipes (from_user_id, to_user_id, action)
    VALUES (?, ?, 'like')
  `);

  const demoUser = {
    id: CURRENT_USER_ID,
    name: "Demo User",
    age: 22,
    photo_url: "https://i.pravatar.cc/600?img=68",
    bio: "Here to discover interesting people.",
    city: "Amritsar",
    interests: JSON.stringify(["Music", "Travel", "Technology"]),
    is_demo_user: 1,
  };

  db.transaction(() => {
    insertUser.run(demoUser);

    for (const profile of mockProfiles) {
      insertUser.run({
        ...profile,
        interests: JSON.stringify(profile.interests),
        is_demo_user: 0,
      });
    }

    for (const profileId of PROFILES_WHO_LIKED_DEMO_USER) {
      insertLike.run(profileId, CURRENT_USER_ID);
    }
  })();
}