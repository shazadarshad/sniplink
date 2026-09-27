import { getDb } from "./db";
import { generateCode } from "./shortcode";
import type { Link } from "@/types";

interface LinkRow {
  id: number;
  code: string;
  url: string;
  created_at: string;
  clicks: number;
}

function rowToLink(row: LinkRow): Link {
  return {
    id: row.id,
    code: row.code,
    url: row.url,
    createdAt: row.created_at,
    clicks: row.clicks,
  };
}

/** Create a short link for a URL, generating a unique code. */
export function createLink(url: string): Link {
  const db = getDb();
  const insert = db.prepare("INSERT INTO links (code, url) VALUES (?, ?)");

  // Generate codes until we find one that isn't taken. Collisions are rare,
  // but retrying keeps the UNIQUE constraint safe.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    try {
      const result = insert.run(code, url);
      return getLinkById(Number(result.lastInsertRowid))!;
    } catch (err) {
      // Unique-constraint clash on code -> try another code.
      if (err instanceof Error && err.message.includes("UNIQUE")) continue;
      throw err;
    }
  }
  throw new Error("Could not generate a unique code, please try again.");
}

export function getLinkById(id: number): Link | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT l.id, l.code, l.url, l.created_at,
              (SELECT COUNT(*) FROM clicks c WHERE c.link_id = l.id) AS clicks
       FROM links l WHERE l.id = ?`,
    )
    .get(id) as LinkRow | undefined;
  return row ? rowToLink(row) : null;
}

export function getLinkByCode(code: string): Link | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT l.id, l.code, l.url, l.created_at,
              (SELECT COUNT(*) FROM clicks c WHERE c.link_id = l.id) AS clicks
       FROM links l WHERE l.code = ?`,
    )
    .get(code) as LinkRow | undefined;
  return row ? rowToLink(row) : null;
}

/** List all links, most recent first, each with its click count. */
export function listLinks(): Link[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT l.id, l.code, l.url, l.created_at,
              (SELECT COUNT(*) FROM clicks c WHERE c.link_id = l.id) AS clicks
       FROM links l ORDER BY l.created_at DESC, l.id DESC`,
    )
    .all() as LinkRow[];
  return rows.map(rowToLink);
}

/** Record a single click on a link. */
export function recordClick(linkId: number): void {
  const db = getDb();
  db.prepare("INSERT INTO clicks (link_id) VALUES (?)").run(linkId);
}
