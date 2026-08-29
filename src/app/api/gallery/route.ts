import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_TAKE = 100;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const requestedTake = Number(
      searchParams.get("take") ?? 60,
    );

    const take =
      Number.isFinite(requestedTake) && requestedTake > 0
        ? Math.min(requestedTake, MAX_TAKE)
        : 60;

    /*
     * If DATABASE_URL is missing, return an empty gallery
     * instead of crashing the page.
     */
    if (
      !process.env.DATABASE_URL ||
      process.env.DATABASE_URL.startsWith("YOUR_")
    ) {
      return NextResponse.json(
        {
          items: [],
          previewMode: true,
        },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "no-store, max-age=0",
          },
        },
      );
    }

    /*
     * Build Prisma filter.
     *
     * Frontend sends:
     *
     * ALL
     * WEDDINGS
     * PRE_WEDDING
     * CHILD
     * MATERNITY
     * CORPORATE
     * PRODUCT
     * EVENT
     */
    const where =
      category &&
      category !== "ALL"
        ? {
            category: category as any,
          }
        : undefined;

    const items =
      await prisma.galleryItem.findMany({
        where,

        orderBy: [
          {
            orderIndex: "asc",
          },
          {
            createdAt: "desc",
          },
        ],

        take,
      });

    return NextResponse.json(
      {
        items,
      },
      {
        status: 200,
        headers: {
          /*
           * Do not cache the gallery for now.
           *
           * This means when you upload a new image,
           * the public gallery can see it immediately
           * after refresh.
           */
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "Gallery API failed:",
      error,
    );

    return NextResponse.json(
      {
        items: [],
        error:
          "Failed to load gallery.",
      },
      {
        status: 500,
      },
    );
  }
}