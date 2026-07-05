import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // cache 5 min

export async function GET() {
  const year = new Date().getFullYear();

  // Fallback when DB isn't configured yet — the widget still animates.
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) {
    return NextResponse.json({ year, totalSlots: 12, booked: 9, remaining: 3, previewMode: true });
  }

  const row = await prisma.yearCapacity.upsert({
    where: { year },
    update: {},
    create: { year, totalSlots: 12, booked: 0 },
  });

  return NextResponse.json({
    year: row.year,
    totalSlots: row.totalSlots,
    booked: row.booked,
    remaining: Math.max(0, row.totalSlots - row.booked),
  });
}
