import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { resolve } from "node:path";
import { initializeDatabase } from "./schema";
import { seedDatabase } from "./seed";

export const DB_PATH = process.env.DATABASE_PATH ?? resolve(process.cwd(), "data", "coy.sqlite");
const globalForDb = globalThis as unknown as { __coyDb?: Database.Database }

function createDatabase(): Database.Database {
  mkdirSync(dirname(DB_PATH), { recursive: true })

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  initializeDatabase(db);
  seedDatabase(db);

  return db;
}

export function getDb(): Database.Database {
  globalForDb.__coyDb ??= createDatabase();
  return globalForDb.__coyDb;
}