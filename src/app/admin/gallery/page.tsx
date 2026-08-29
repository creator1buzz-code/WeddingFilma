import Image from "next/image";

import { prisma } from "@/lib/prisma";

import GalleryUploader from "@/components/admin/GalleryUploader";
import GalleryDeleteButton from "@/components/admin/GalleryDeleteButton";

async function getGalleryItems() {
  if (
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.startsWith(
      "YOUR_",
    )
  ) {
    return [];
  }

  return prisma.galleryItem.findMany({
    orderBy: [
      {
        orderIndex: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 100,
  });
}

function displayCategory(
  category: string,
) {
  switch (category) {
    case "WEDDINGS":
      return "Weddings";

    case "PRE_WEDDING":
      return "Pre-Wedding";

    case "CHILD":
      return "Child";

    case "MATERNITY":
      return "Maternity";

    case "CORPORATE":
      return "Corporate";

    case "PRODUCT":
      return "Product";

    case "EVENT":
      return "Event";

    default:
      return category;
  }
}

export default async function AdminGalleryPage() {
  const items =
    await getGalleryItems();

  return (
    <div className="p-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Admin
          </p>

          <h1 className="font-serif text-4xl">
            Gallery
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Upload and manage your
            photography and films.
          </p>
        </div>

        <GalleryUploader />
      </div>

      {/* GALLERY */}
      {items.length === 0 ? (
        <div className="border border-border rounded-sm p-16 text-center">
          <p className="text-muted-foreground">
            No media uploaded yet.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Use the Upload Media button
            to add your first gallery item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const imageSource =
              item.thumbnail ||
              item.url;

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-sm bg-secondary border border-border"
              >
                {/* MEDIA */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {item.mediaType ===
                  "VIDEO" ? (
                    <video
                      src={item.url}
                      poster={
                        item.thumbnail ||
                        undefined
                      }
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={imageSource}
                      alt={item.title}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  {/* VIDEO BADGE */}
                  {item.mediaType ===
                    "VIDEO" && (
                    <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-white backdrop-blur-sm">
                      Video
                    </div>
                  )}

                  {/* FEATURED BADGE */}
                  {item.featured && (
                    <div className="absolute left-3 bottom-3 rounded-full bg-accent px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-accent-foreground">
                      Featured
                    </div>
                  )}

                  {/* DELETE */}
                  <GalleryDeleteButton
                    id={item.id}
                    title={item.title}
                  />
                </div>

                {/* DETAILS */}
                <div className="p-4">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                    {displayCategory(
                      item.category,
                    )}
                  </p>

                  <p className="font-serif text-lg mt-1">
                    {item.title}
                  </p>

                  {item.description && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {
                        item.description
                      }
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}