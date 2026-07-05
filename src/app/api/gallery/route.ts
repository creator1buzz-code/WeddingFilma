import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const take = Number(searchParams.get("take") ?? 60);

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) {
    return NextResponse.json({ items: [], previewMode: true });
  }

  const items = await prisma.galleryItem.findMany({
    where: category && category !== "ALL"
      ? { category: category as any }
      : undefined,
    orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
    take,
  });

  return NextResponse.json({ items });
}
