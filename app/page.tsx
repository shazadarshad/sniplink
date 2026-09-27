import Link from "next/link";
import { ShortenForm } from "@/components/ShortenForm";

export default function Home() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Free & instant link shortening
        </span>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Shorten links, <span className="gradient-text">track every click</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          Turn long, messy URLs into clean short links — and see exactly how many
          times each one gets opened.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-6">
          <ShortenForm />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Dot /> No sign-up needed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Dot /> Click analytics
          </span>
          <Link href="/dashboard" className="font-medium text-indigo-600 hover:underline">
            View your links →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />;
}
