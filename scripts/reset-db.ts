import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { initializeDatabase } from "../src/server/db/schema";
import { seedDatabase } from "../src/server/db/seed";
import { DB_PATH } from "@/server/db/connection";

mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

initializeDatabase(db);
db.exec("DELETE FROM users"); 
seedDatabase(db);

console.log("Database reset and re-seeded.");