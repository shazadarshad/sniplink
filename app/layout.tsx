import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Sniplink — URL Shortener",
  description: "Shorten long URLs and track how many times they're clicked.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-md">
          <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 text-white shadow-sm">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07L11 5" />
                  <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07L13 19" />
                </svg>
              </span>
              <span className="text-lg">Sniplink</span>
            </Link>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Link href="/" className="rounded-lg px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                Shorten
              </Link>
              <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                Dashboard
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">{children}</main>

        <footer className="border-t border-slate-200/70 py-6 text-center text-sm text-slate-400">
          Sniplink · a small URL shortener demo
        </footer>
      </body>
    </html>
  );
}
