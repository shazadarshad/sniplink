import Link from "next/link";
import { ShortenForm } from "@/components/ShortenForm";

export default function Home() {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Shorten your links
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Turn long URLs into short, shareable links — and see how many times each one gets clicked.
        </p>
      </div>

      <div className="mt-8">
        <ShortenForm />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Want to see your links and their clicks?{" "}
        <Link href="/dashboard" className="font-medium text-indigo-600 hover:underline">
          Open the dashboard →
        </Link>
      </p>
    </div>
  );
}
