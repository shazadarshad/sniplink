// Pure helpers with no I/O, so they're easy to unit-test.

// Characters used in short codes: no look-alikes (0/O, 1/l/I) for readability.
const ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generate a random short code of the given length. Uses a readable
 * alphabet (no ambiguous characters).
 */
export function generateCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

/** True if a string is a valid short code (only allowed characters). */
export function isValidCode(code: string): boolean {
  if (!code) return false;
  return [...code].every((ch) => ALPHABET.includes(ch));
}

/**
 * Validate and normalise a URL. Returns the normalised URL string, or null
 * if it isn't a valid http(s) URL. Bare domains like "example.com" get
 * "https://" prepended.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return null;
  }

  // Only allow http/https, and require a dotted hostname (rejects "https://foo").
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  if (!parsed.hostname.includes(".")) return null;

  return parsed.toString();
}
