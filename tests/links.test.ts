import { describe, it, expect, beforeEach } from "vitest";
import { getDb } from "@/lib/db";
import {
  createLink,
  getLinkByCode,
  getLinkById,
  listLinks,
  recordClick,
} from "@/lib/links";

beforeEach(() => {
  // Fresh state for each test (shared in-memory connection).
  const db = getDb();
  db.exec("DELETE FROM clicks; DELETE FROM links;");
});

describe("createLink", () => {
  it("creates a link with a valid unique code", () => {
    const link = createLink("https://example.com/");
    expect(link.code).toHaveLength(6);
    expect(link.url).toBe("https://example.com/");
    expect(link.clicks).toBe(0);

    const found = getLinkByCode(link.code);
    expect(found?.id).toBe(link.id);
  });

  it("gives different links different codes", () => {
    const a = createLink("https://a.com/");
    const b = createLink("https://b.com/");
    expect(a.code).not.toBe(b.code);
  });
});

describe("recordClick + click counting", () => {
  it("counts clicks per link", () => {
    const link = createLink("https://example.com/");
    expect(getLinkById(link.id)?.clicks).toBe(0);

    recordClick(link.id);
    recordClick(link.id);
    recordClick(link.id);

    expect(getLinkById(link.id)?.clicks).toBe(3);
    expect(getLinkByCode(link.code)?.clicks).toBe(3);
  });

  it("keeps click counts independent per link", () => {
    const a = createLink("https://a.com/");
    const b = createLink("https://b.com/");

    recordClick(a.id);
    recordClick(a.id);
    recordClick(b.id);

    expect(getLinkById(a.id)?.clicks).toBe(2);
    expect(getLinkById(b.id)?.clicks).toBe(1);
  });
});

describe("listLinks", () => {
  it("returns an empty array when there are no links", () => {
    expect(listLinks()).toEqual([]);
  });

  it("returns all links, most recent first", () => {
    const first = createLink("https://first.com/");
    const second = createLink("https://second.com/");

    const all = listLinks();
    expect(all).toHaveLength(2);
    // Most recent (higher id) should come first.
    expect(all[0].id).toBe(second.id);
    expect(all[1].id).toBe(first.id);
  });

  it("includes click counts in the listing", () => {
    const link = createLink("https://example.com/");
    recordClick(link.id);
    const all = listLinks();
    expect(all[0].clicks).toBe(1);
  });
});

describe("getLinkByCode", () => {
  it("returns null for an unknown code", () => {
    expect(getLinkByCode("nope99")).toBeNull();
  });
});
