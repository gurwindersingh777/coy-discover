import Database from "better-sqlite3";
import { initializeDatabase } from "../db/schema";
import { seedDatabase } from "../db/seed";

export function createTestDb() {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  initializeDatabase(db);
  seedDatabase(db);
  return db;
}