import { redirect, notFound } from "next/navigation";
import { getLinkByCode, recordClick } from "@/lib/links";
import { isValidCode } from "@/lib/shortcode";

// This route reads the DB and redirects at request time.
export const dynamic = "force-dynamic";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (!isValidCode(code)) {
    notFound();
  }

  const link = getLinkByCode(code);
  if (!link) {
    notFound();
  }

  // Log the click before sending the visitor on their way.
  recordClick(link.id);

  // redirect() throws internally, so code after it never runs.
  redirect(link.url);
}
