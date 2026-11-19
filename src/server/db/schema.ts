import type Database from "better-sqlite3";

export function initializeDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL CHECK (age >= 18),
      photo_url TEXT NOT NULL,
      bio TEXT NOT NULL,
      city TEXT NOT NULL,
      interests TEXT NOT NULL,
      is_demo_user INTEGER NOT NULL DEFAULT 0
        CHECK (is_demo_user IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id TEXT NOT NULL,
      to_user_id TEXT NOT NULL,
      action TEXT NOT NULL CHECK (action IN ('like', 'pass')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (from_user_id)
        REFERENCES users(id) ON DELETE CASCADE,

      FOREIGN KEY (to_user_id)
        REFERENCES users(id) ON DELETE CASCADE,

      CHECK (from_user_id != to_user_id),

      UNIQUE (from_user_id, to_user_id)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_one_id TEXT NOT NULL,
      user_two_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_one_id)
        REFERENCES users(id) ON DELETE CASCADE,

      FOREIGN KEY (user_two_id)
        REFERENCES users(id) ON DELETE CASCADE,

      CHECK (user_one_id < user_two_id),

      UNIQUE (user_one_id, user_two_id)
    );

    CREATE INDEX IF NOT EXISTS idx_swipes_to_user
    ON swipes(to_user_id);

    CREATE INDEX IF NOT EXISTS idx_matches_user_two
    ON matches(user_two_id);
  `);
}