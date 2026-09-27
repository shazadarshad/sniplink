import { NextResponse } from "next/server";
import { normalizeUrl } from "@/lib/shortcode";
import { createLink } from "@/lib/links";

// POST /api/shorten  { url }  ->  { code, url, shortUrl }
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const normalized = normalizeUrl(typeof body?.url === "string" ? body.url : "");

    if (!normalized) {
      return NextResponse.json(
        { error: "Please enter a valid URL (e.g. https://example.com)." },
        { status: 400 },
      );
    }

    const link = createLink(normalized);
    const shortUrl = new URL(`/${link.code}`, request.url).toString();

    return NextResponse.json({ code: link.code, url: link.url, shortUrl }, { status: 201 });
  } catch (error) {
    console.error("POST /api/shorten", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
