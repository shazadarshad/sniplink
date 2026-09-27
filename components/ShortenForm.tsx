"use client";

import { useState } from "react";

interface Result {
  shortUrl: string;
  url: string;
}

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);

    if (!url.trim()) {
      setError("Please enter a URL to shorten.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResult({ shortUrl: data.shortUrl, url: data.url });
      setUrl("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="url" className="sr-only">
          URL to shorten
        </label>
        <input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a long URL, e.g. https://example.com/very/long/path"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Shortening…" : "Shorten link"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-400">Your short link</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-base font-semibold text-indigo-600 hover:underline"
            >
              {result.shortUrl}
            </a>
            <button
              onClick={copy}
              className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 truncate text-xs text-slate-500">→ {result.url}</p>
        </div>
      )}
    </div>
  );
}
