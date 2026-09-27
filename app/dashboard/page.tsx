import Link from "next/link";
import { headers } from "next/headers";
import { listLinks } from "@/lib/links";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — Sniplink" };

function formatDate(iso: string): string {
  // Stored as "YYYY-MM-DD HH:MM:SS" (UTC from SQLite datetime()).
  const date = new Date(iso.replace(" ", "T") + "Z");
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const links = listLinks();

  // Build absolute short URLs from the incoming request host.
  const host = (await headers()).get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const base = `${proto}://${host}`;

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            {links.length} link{links.length === 1 ? "" : "s"} · {totalClicks} total click
            {totalClicks === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + New link
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No links yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Shorten your first URL and it will show up here with its click count.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Shorten a link
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Short link</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <a
                      href={`/${link.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {base.replace(/^https?:\/\//, "")}/{link.code}
                    </a>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-600" title={link.url}>
                    {link.url}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">{link.clicks}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{formatDate(link.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
