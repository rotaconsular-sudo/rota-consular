import { notFound } from "next/navigation";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { requireOwnApplication } from "@/lib/applications";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params;
  const user = await requireUser();
  await requireOwnApplication(user.id, id);

  const document = await prisma.document.findUnique({
    where: { id: docId, applicationId: id },
  });
  if (!document || !document.url) notFound();

  const blob = await get(document.url, { access: "private" });
  if (!blob) notFound();

  return new Response(blob.stream, {
    headers: {
      "Content-Type": blob.blob.contentType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${document.fileName}"`,
    },
  });
}
