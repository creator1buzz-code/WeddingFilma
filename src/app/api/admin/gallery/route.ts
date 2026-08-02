import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const title =
      (formData.get("title") as string) ||
      file.name.replace(/\.[^/.]+$/, "");

    const description =
      (formData.get("description") as string) || "";

    const category =
      (formData.get("category") as string) || "WEDDINGS";

    const featured =
      formData.get("featured") === "true";

    const mediaType = file.type.startsWith("video")
      ? "VIDEO"
      : "IMAGE";

    const ext = file.name.split(".").pop();

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const upload = await supabaseAdmin.storage
      .from("gallery")
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (upload.error) {
      console.error(upload.error);

      return NextResponse.json(
        { error: upload.error.message },
        { status: 500 }
      );
    }

    const publicUrl = supabaseAdmin.storage
      .from("gallery")
      .getPublicUrl(fileName).data.publicUrl;

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description,
        category: category as any,
        mediaType: mediaType as any,
        url: publicUrl,
        thumbnail: publicUrl,
        featured,
        tags: [],
      },
    });

    return NextResponse.json(item);

  } catch (e) {

    console.error(e);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );

  }
}
