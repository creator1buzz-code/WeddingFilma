import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateBookingCode } from "@/lib/utils";
import { sendAdminNotification, sendBookingConfirmation } from "@/lib/resend";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  eventType: z.enum([
    "WEDDING", "PRE_WEDDING", "ENGAGEMENT", "MATERNITY", "CHILD",
    "CORPORATE", "PRODUCT", "EVENT", "OTHER",
  ]),
  eventDate: z.string().min(1),
  venue: z.string().nullish(),
  city: z.string().min(1),
  budget: z.string().nullish(),
  guestCount: z.number().int().nullish(),
  services: z.array(z.string()).default([]),
  notes: z.string().nullish(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // If DATABASE_URL isn't configured, respond gracefully with a fake code
    // so the UI still works during initial setup.
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) {
      const code = generateBookingCode();
      await sendAdminNotification({ ...data, bookingCode: code, eventDate: data.eventDate });
      await sendBookingConfirmation({ ...data, bookingCode: code, eventDate: data.eventDate });
      return NextResponse.json({ bookingCode: code, previewMode: true }, { status: 201 });
    }

    const bookingCode = generateBookingCode();
    const created = await prisma.booking.create({
      data: {
        bookingCode,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: new Date(data.eventDate),
        venue: data.venue ?? null,
        city: data.city,
        budget: data.budget ?? null,
        guestCount: data.guestCount ?? null,
        services: data.services,
        notes: data.notes ?? null,
      },
    });

    await Promise.allSettled([
      sendAdminNotification(created),
      sendBookingConfirmation(created),
    ]);

    return NextResponse.json({ bookingCode }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: err.flatten() }, { status: 400 });
    }
    console.error("booking create failed", err);
    return NextResponse.json({ error: "Could not create booking" }, { status: 500 });
  }
}
