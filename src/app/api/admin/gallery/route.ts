import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "gallery";

const ALLOWED_CATEGORIES = [
  "WEDDINGS",
  "PRE_WEDDING",
  "CHILD",
  "MATERNITY",
  "CORPORATE",
  "PRODUCT",
  "EVENT",
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function jsonError(
  message: string,
  status = 400,
) {
  return NextResponse.json(
    { error: message },
    { status },
  );
}

/**
 * POST
 *
 * Creates the Prisma GalleryItem record.
 *
 * IMPORTANT:
 * The actual image/video is NOT sent to this endpoint.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      category,
      mediaType,
      url,
      thumbnail,
      featured,
      tags,
      storagePath,
    } = body;

    if (!title || typeof title !== "string") {
      return jsonError("A title is required.");
    }

    if (
      !category ||
      !ALLOWED_CATEGORIES.includes(category)
    ) {
      return jsonError(
        "Invalid gallery category.",
      );
    }

    if (!url || typeof url !== "string") {
      return jsonError(
        "A gallery URL is required.",
      );
    }

    if (
      !storagePath ||
      typeof storagePath !== "string"
    ) {
      return jsonError(
        "Storage path is required.",
      );
    }

    if (
      mediaType !== "IMAGE" &&
      mediaType !== "VIDEO"
    ) {
      return jsonError(
        "Invalid media type.",
      );
    }

    const item =
      await prisma.galleryItem.create({
        data: {
          title: title.trim(),

          description:
            typeof description === "string"
              ? description.trim() || null
              : null,

          category: category as any,

          mediaType: mediaType as any,

          url,

          thumbnail:
            thumbnail || url,

          featured: Boolean(featured),

          tags: Array.isArray(tags)
            ? tags.filter(
                (
                  tag: unknown,
                ): tag is string =>
                  typeof tag ===
                  "string",
              )
            : [],
        },
      });

    return NextResponse.json(
      {
        success: true,
        item,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Gallery metadata creation failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to create gallery item.",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT
 *
 * Creates a signed upload token for the browser.
 *
 * IMPORTANT:
 * The actual file is NOT uploaded through Vercel.
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fileName,
      contentType,
      fileSize,
    } = body;

    if (
      !fileName ||
      typeof fileName !== "string"
    ) {
      return jsonError(
        "File name is required.",
      );
    }

    if (
      !contentType ||
      typeof contentType !== "string"
    ) {
      return jsonError(
        "File type is required.",
      );
    }

    if (
      !Number.isFinite(fileSize) ||
      fileSize <= 0
    ) {
      return jsonError(
        "Invalid file size.",
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return jsonError(
        "File is larger than the 50 MB gallery limit.",
      );
    }

    const isImage =
      ALLOWED_IMAGE_TYPES.includes(
        contentType,
      );

    const isVideo =
      ALLOWED_VIDEO_TYPES.includes(
        contentType,
      );

    if (!isImage && !isVideo) {
      return jsonError(
        "Unsupported file type. Please upload JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM or MOV.",
      );
    }

    const extension =
      fileName
        .split(".")
        .pop()
        ?.toLowerCase() || "bin";

    const safeExtension =
      extension.replace(
        /[^a-z0-9]/g,
        "",
      );

    const uniqueName =
      `${crypto.randomUUID()}.${safeExtension}`;

    /*
     * IMPORTANT:
     *
     * This is the path INSIDE the gallery bucket.
     *
     * DO NOT use:
     *
     * gallery/filename.jpg
     *
     * because we already call:
     *
     * .from("gallery")
     */
    const storagePath =
      uniqueName;

    const supabaseAdmin =
      getSupabaseAdmin();

    const {
      data,
      error,
    } =
      await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUploadUrl(
          storagePath,
          {
            upsert: false,
          },
        );

    if (error || !data) {
      console.error(
        "Signed upload URL error:",
        error,
      );

      return NextResponse.json(
        {
          error:
            error?.message ||
            "Unable to create upload authorization.",
        },
        { status: 500 },
      );
    }

    const projectUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    if (!projectUrl) {
      return jsonError(
        "NEXT_PUBLIC_SUPABASE_URL is not configured.",
        500,
      );
    }

    const projectId =
      new URL(
        projectUrl,
      ).hostname.split(".")[0];

    return NextResponse.json({
      success: true,

      bucket: BUCKET,

      /*
       * This is now just:
       *
       * abc123.jpg
       *
       * rather than:
       *
       * gallery/abc123.jpg
       */
      path: storagePath,

      token: data.token,

      projectId,

      contentType,

      fileSize,
    });
  } catch (error) {
    console.error(
      "Gallery upload authorization failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to authorize gallery upload.",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE
 *
 * Deletes both:
 *
 * 1. Supabase Storage object
 * 2. Prisma GalleryItem
 */
export async function DELETE(
  req: NextRequest,
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const id =
      searchParams.get("id");

    if (!id) {
      return jsonError(
        "Gallery item ID is required.",
      );
    }

    const item =
      await prisma.galleryItem.findUnique(
        {
          where: { id },
        },
      );

    if (!item) {
      return jsonError(
        "Gallery item not found.",
        404,
      );
    }

    let storagePath:
      | string
      | null = null;

    try {
      const url =
        new URL(item.url);

      const marker =
        `/storage/v1/object/public/${BUCKET}/`;

      const index =
        url.pathname.indexOf(marker);

      if (index !== -1) {
        storagePath =
          decodeURIComponent(
            url.pathname.substring(
              index +
                marker.length,
            ),
          );
      }
    } catch {
      console.error(
        "Could not parse gallery URL:",
        item.url,
      );
    }

    if (storagePath) {
      try {
        const supabaseAdmin =
          getSupabaseAdmin();

        const { error } =
          await supabaseAdmin.storage
            .from(BUCKET)
            .remove([
              storagePath,
            ]);

        if (error) {
          console.error(
            "Storage deletion failed:",
            error,
          );
        }
      } catch (storageError) {
        console.error(
          "Storage client error:",
          storageError,
        );
      }
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Gallery deletion failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete gallery item.",
      },
      { status: 500 },
    );
  }
}