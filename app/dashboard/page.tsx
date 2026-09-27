import Link from "next/link";
import { headers } from "next/headers";
import { listLinks } from "@/lib/links";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — Sniplink" };

function formatDate(iso: string): string {
  const date = new Date(iso.replace(" ", "T") + "Z");
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const links = listLinks();
  const host = (await headers()).get("host") ?? "localhost:3000";
  const displayHost = host;

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const topClicks = links.reduce((max, l) => Math.max(max, l.clicks), 0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">All your short links and how they&apos;re performing.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          + New link
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07L11 5" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07L13 19" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900">No links yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Shorten your first URL and it&apos;ll show up here with its click count.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Shorten a link
          </Link>
        </div>
      ) : (
        <>
          {/* Summary stat cards */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <StatCard label="Links" value={links.length} />
            <StatCard label="Total clicks" value={totalClicks} />
            <StatCard label="Top link" value={topClicks} suffix={topClicks === 1 ? "click" : "clicks"} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Short link</th>
                  <th className="px-5 py-3 font-semibold">Destination</th>
                  <th className="px-5 py-3 text-right font-semibold">Clicks</th>
                  <th className="px-5 py-3 text-right font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {links.map((link) => (
                  <tr key={link.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-3">
                      <a
                        href={`/${link.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        {displayHost}/{link.code}
                      </a>
                    </td>
                    <td className="max-w-xs truncate px-5 py-3 text-slate-600" title={link.url}>
                      {link.url}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {link.clicks}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-slate-500">{formatDate(link.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
        {suffix && <span className="ml-1 text-sm font-medium text-slate-400">{suffix}</span>}
      </p>
    </div>
  );
}
