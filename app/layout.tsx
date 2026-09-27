import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sniplink — URL Shortener",
  description: "Shorten long URLs and track how many times they're clicked.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold text-indigo-600">
              Sniplink
            </Link>
            <div className="flex gap-4 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-slate-900">Shorten</Link>
              <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
