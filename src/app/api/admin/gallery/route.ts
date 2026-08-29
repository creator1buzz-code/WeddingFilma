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

          featured: Boolean(
            featured,
          ),

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
 * The actual media file is uploaded directly
 * from the browser to Supabase Storage.
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

    if (
      fileSize > MAX_FILE_SIZE
    ) {
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

    const projectUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    if (!projectUrl) {
      return jsonError(
        "NEXT_PUBLIC_SUPABASE_URL is not configured.",
        500,
      );
    }

    return NextResponse.json({
      success: true,
      bucket: BUCKET,
      path: storagePath,
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
 * 1. The actual object from Supabase Storage
 * 2. The GalleryItem row from PostgreSQL
 *
 * The Storage object is deleted FIRST.
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
     * Find database record.
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

    /**
     * Determine the Storage object path
     * from the public Supabase URL.
     *
     * Expected URL:
     *
     * https://PROJECT.supabase.co/
     * storage/v1/object/public/gallery/
     * filename.jpg
     */
    let storagePath:
      | string
      | null = null;

    try {
      const url =
        new URL(item.url);

      const marker =
        `/storage/v1/object/public/${BUCKET}/`;

      const markerIndex =
        url.pathname.indexOf(
          marker,
        );

      if (
        markerIndex !== -1
      ) {
        storagePath =
          decodeURIComponent(
            url.pathname.substring(
              markerIndex +
                marker.length,
            ),
          );
      }
    } catch (error) {
      console.error(
        "Could not parse gallery URL:",
        error,
      );
    }

    /**
     * Delete the physical file from
     * Supabase Storage first.
     *
     * Supabase documents remove([...])
     * as the Storage API for object deletion.
     */
    if (storagePath) {
      const supabaseAdmin =
        getSupabaseAdmin();

      const {
        data,
        error,
      } =
        await supabaseAdmin.storage
          .from(BUCKET)
          .remove([
            storagePath,
          ]);

      console.log(
        "Gallery Storage deletion:",
        {
          storagePath,
          data,
          error,
        },
      );

      if (error) {
        console.error(
          "Supabase Storage deletion failed:",
          error,
        );

        return NextResponse.json(
          {
            error:
              "Could not delete the media file from Supabase Storage. The database record was kept.",
          },
          {
            status: 500,
          },
        );
      }

      /**
       * If Supabase returns an empty result
       * because the file no longer exists,
       * that's still safe to continue.
       */
      if (
        Array.isArray(data) &&
        data.length === 0
      ) {
        console.warn(
          "Storage deletion returned no deleted objects:",
          storagePath,
        );
      }
    }

    /**
     * Only after Storage deletion succeeds,
     * remove the Prisma record.
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
      deletedId: id,
      storagePath,
    });
  } catch (error) {
    console.error(
      "Gallery deletion failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete gallery item.",
      },
      {
        status: 500,
      },
    );
  }
}