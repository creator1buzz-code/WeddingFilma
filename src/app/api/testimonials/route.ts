import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) {
    return NextResponse.json({ items: [], previewMode: true });
  }
  const items = await prisma.testimonial.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 12,
  });
  return NextResponse.json({ items });
}
