import { describe, it, expect } from "vitest";
import { generateCode, isValidCode, normalizeUrl } from "@/lib/shortcode";

describe("generateCode", () => {
  it("has the requested length", () => {
    expect(generateCode()).toHaveLength(6);
    expect(generateCode(10)).toHaveLength(10);
  });

  it("uses only allowed (unambiguous) characters", () => {
    const code = generateCode(50);
    expect(isValidCode(code)).toBe(true);
    // No ambiguous characters.
    expect(/[0O1lI]/.test(code)).toBe(false);
  });

  it("is reasonably unique across many calls", () => {
    const codes = new Set(Array.from({ length: 500 }, () => generateCode()));
    // Allow a tiny chance of collision, but expect near-uniqueness.
    expect(codes.size).toBeGreaterThan(495);
  });
});

describe("isValidCode", () => {
  it("accepts valid codes and rejects invalid ones", () => {
    expect(isValidCode("abcDEF")).toBe(true);
    expect(isValidCode("")).toBe(false);
    expect(isValidCode("has space")).toBe(false);
    expect(isValidCode("bad/slash")).toBe(false);
    expect(isValidCode("0O1lI")).toBe(false); // ambiguous chars aren't in the alphabet
  });
});

describe("normalizeUrl", () => {
  it("accepts full http(s) URLs", () => {
    expect(normalizeUrl("https://example.com")).toBe("https://example.com/");
    expect(normalizeUrl("http://example.com/a/b?c=1")).toBe("http://example.com/a/b?c=1");
  });

  it("prepends https:// to bare domains", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com/");
    expect(normalizeUrl("  example.com/path  ")).toBe("https://example.com/path");
  });

  it("rejects invalid or non-http URLs", () => {
    expect(normalizeUrl("")).toBeNull();
    expect(normalizeUrl("not a url")).toBeNull();
    expect(normalizeUrl("ftp://example.com")).toBeNull();
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeUrl("https://nodots")).toBeNull();
  });
});
