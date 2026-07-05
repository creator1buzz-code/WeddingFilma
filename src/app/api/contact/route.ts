import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactAdmin } from "@/lib/resend";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().nullish(),
  subject: z.string().nullish(),
  message: z.string().min(5),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("YOUR_")) {
      await prisma.contactMessage.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          subject: data.subject ?? null,
          message: data.message,
        },
      });
    }

    await sendContactAdmin({
      name: data.name,
      email: data.email,
      phone: data.phone ?? undefined,
      subject: data.subject ?? undefined,
      message: data.message,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not send message" }, { status: 500 });
  }
}
