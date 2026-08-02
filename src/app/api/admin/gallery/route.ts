import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const title =
      (formData.get("title") as string) || file.name.split(".")[0];

    const description =
      (formData.get("description") as string) || "";

    const category =
      (formData.get("category") as string) || "WEDDINGS";

    const featured =
      formData.get("featured") === "true";

    const mediaType = file.type.startsWith("video")
      ? "VIDEO"
      : "IMAGE";

    const extension = file.name.split(".").pop();

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from("gallery")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description,
        category: category as any,
        mediaType: mediaType as any,
        url: data.publicUrl,
        thumbnail: data.publicUrl,
        featured,
        tags: [],
      },
    });

    return NextResponse.json(item);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
