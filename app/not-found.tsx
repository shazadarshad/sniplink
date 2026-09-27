import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Link not found</h1>
      <p className="mt-2 text-slate-600">
        This short link doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Shorten a new link
      </Link>
    </div>
  );
}
