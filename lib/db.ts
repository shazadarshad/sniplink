import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

/**
 * A single shared SQLite connection. In development Next.js reloads modules
 * often, so we cache the connection on globalThis to avoid opening a new
 * handle (and re-running schema setup) on every hot reload.
 */
declare global {
  // eslint-disable-next-line no-var
  var __sniplinkDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  // Allow an override (e.g. ":memory:" in tests) via SNIPLINK_DB.
  const dbPath = process.env.SNIPLINK_DB ?? path.join(process.cwd(), "data", "sniplink.db");

  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  initSchema(db);
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      url TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      link_id INTEGER NOT NULL,
      clicked_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
  `);
}

export function getDb(): Database.Database {
  if (!globalThis.__sniplinkDb) {
    globalThis.__sniplinkDb = createConnection();
  }
  return globalThis.__sniplinkDb;
}
