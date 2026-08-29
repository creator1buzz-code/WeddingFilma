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
    {
      error: message,
    },
    {
      status,
    },
  );
}

/**
 * POST
 *
 * Creates the Prisma GalleryItem record.
 *
 * IMPORTANT:
 * The actual media file is uploaded directly
 * from the browser to Supabase Storage.
 *
 * Vercel only receives metadata here.
 */
export async function POST(
  req: NextRequest,
) {
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

    if (
      !title ||
      typeof title !== "string"
    ) {
      return jsonError(
        "A title is required.",
      );
    }

    if (
      !category ||
      !ALLOWED_CATEGORIES.includes(
        category,
      )
    ) {
      return jsonError(
        "Invalid gallery category.",
      );
    }

    if (
      !url ||
      typeof url !== "string"
    ) {
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
            typeof description ===
            "string"
              ? description.trim() || null
              : null,

          category: category as any,

          mediaType: mediaType as any,

          url,

          thumbnail:
            typeof thumbnail ===
              "string" &&
            thumbnail.trim()
              ? thumbnail
              : url,

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
      {
        status: 201,
      },
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
      {
        status: 500,
      },
    );
  }
}

/**
 * PUT
 *
 * Creates a temporary signed upload URL.
 *
 * IMPORTANT:
 *
 * The actual media file is NOT uploaded
 * through Vercel.
 *
 * The browser will upload directly
 * to Supabase Storage using the signed URL.
 */
export async function PUT(
  req: NextRequest,
) {
  try {
    const body = await req.json();

    const {
      fileName,
      contentType,
      fileSize,
    } = body;

    /**
     * Validate filename
     */
    if (
      !fileName ||
      typeof fileName !== "string"
    ) {
      return jsonError(
        "File name is required.",
      );
    }

    /**
     * Validate MIME type
     */
    if (
      !contentType ||
      typeof contentType !== "string"
    ) {
      return jsonError(
        "File type is required.",
      );
    }

    /**
     * Validate file size
     */
    if (
      !Number.isFinite(fileSize) ||
      fileSize <= 0
    ) {
      return jsonError(
        "Invalid file size.",
      );
    }

    /**
     * Maximum 50 MB
     */
    if (
      fileSize > MAX_FILE_SIZE
    ) {
      return jsonError(
        "File is larger than the 50 MB gallery limit.",
      );
    }

    /**
     * Validate image/video type
     */
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

    /**
     * Extract extension
     */
    const extension =
      fileName
        .split(".")
        .pop()
        ?.toLowerCase() || "bin";

    /**
     * Sanitize extension
     */
    const safeExtension =
      extension.replace(
        /[^a-z0-9]/g,
        "",
      );

    /**
     * Generate a unique filename.
     *
     * Example:
     *
     * 8f53dbd8-047f-43e9-9621-866af6acdc1f.jpg
     */
    const uniqueName =
      `${crypto.randomUUID()}.${safeExtension}`;

    /**
     * IMPORTANT:
     *
     * This is the path INSIDE the bucket.
     *
     * Correct:
     *
     * abc123.jpg
     *
     * NOT:
     *
     * gallery/abc123.jpg
     */
    const storagePath =
      uniqueName;

    /**
     * Create server-side Supabase admin client.
     *
     * SUPABASE_SERVICE_ROLE_KEY
     * NEVER goes to the browser.
     */
    const supabaseAdmin =
      getSupabaseAdmin();

    /**
     * Create signed upload URL.
     *
     * This is the important change.
     *
     * We are no longer using the TUS
     * resumable endpoint from the browser.
     */
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

    if (
      error ||
      !data
    ) {
      console.error(
        "Signed upload URL creation failed:",
        error,
      );

      return NextResponse.json(
        {
          error:
            error?.message ||
            "Unable to create upload authorization.",
        },
        {
          status: 500,
        },
      );
    }

    /**
     * Supabase returns:
     *
     * data.signedUrl
     * data.token
     * data.path
     *
     * We only need the signed URL and path
     * on the browser side.
     */
    const projectUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    if (!projectUrl) {
      return jsonError(
        "NEXT_PUBLIC_SUPABASE_URL is not configured.",
        500,
      );
    }

    /**
     * Diagnostic logging.
     *
     * DO NOT log:
     *
     * - service role key
     * - signed URL
     * - token
     */
    console.log(
      "Gallery upload authorization created:",
      {
        bucket: BUCKET,
        storagePath,
        contentType,
        fileSize,
        projectUrl,
      },
    );

    return NextResponse.json({
      success: true,

      bucket: BUCKET,

      path: storagePath,

      /**
       * Temporary signed URL.
       *
       * This is safe to send to the browser
       * because it is time-limited and scoped
       * to this particular upload.
       */
      signedUrl: data.signedUrl,

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
      {
        status: 500,
      },
    );
  }
}

/**
 * DELETE
 *
 * Deletes:
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

    /**
     * Find gallery record
     */
    const item =
      await prisma.galleryItem.findUnique(
        {
          where: {
            id,
          },
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

    /**
     * Extract storage path from public URL.
     */
    try {
      const url =
        new URL(item.url);

      const marker =
        `/storage/v1/object/public/${BUCKET}/`;

      const index =
        url.pathname.indexOf(
          marker,
        );

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

    /**
     * Delete object from Supabase Storage.
     */
    if (storagePath) {
      try {
        const supabaseAdmin =
          getSupabaseAdmin();

        const {
          error,
        } =
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
      } catch (
        storageError
      ) {
        console.error(
          "Storage client error:",
          storageError,
        );
      }
    }

    /**
     * Delete database record.
     */
    await prisma.galleryItem.delete(
      {
        where: {
          id,
        },
      },
    );

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
      {
        status: 500,
      },
    );
  }
}