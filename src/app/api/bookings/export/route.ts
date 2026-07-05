import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function csvEscape(v: any) {
  if (v == null) return "";
  const s = String(v).replaceAll('"', '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

export async function GET() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) {
    return new NextResponse("bookingCode,fullName,email,phone,eventType,eventDate,city,status\n", {
      headers: { "content-type": "text/csv" },
    });
  }
  const rows = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
  const header = "bookingCode,fullName,email,phone,eventType,eventDate,city,venue,budget,services,notes,status,createdAt";
  const body = rows.map((r) => [
    r.bookingCode, r.fullName, r.email, r.phone, r.eventType,
    r.eventDate.toISOString(), r.city, r.venue, r.budget,
    r.services.join("|"), r.notes, r.status, r.createdAt.toISOString(),
  ].map(csvEscape).join(",")).join("\n");
  return new NextResponse(`${header}\n${body}`, {
    headers: {
      "content-type": "text/csv",
      "content-disposition": `attachment; filename="bookings-${Date.now()}.csv"`,
    },
  });
}
