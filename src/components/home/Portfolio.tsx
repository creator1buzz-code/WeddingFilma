"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Weddings",
  "Pre-Wedding",
  "Child",
  "Corporate",
] as const;

type Category =
  (typeof CATEGORIES)[number];

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  mediaType: "IMAGE" | "VIDEO";
  url: string;
  thumbnail: string | null;
  featured: boolean;
  tags: string[];
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

function categoryToApiValue(
  category: Category,
): string {
  switch (category) {
    case "Weddings":
      return "WEDDINGS";

    case "Pre-Wedding":
      return "PRE_WEDDING";

    case "Child":
      return "CHILD";

    case "Corporate":
      return "CORPORATE";

    case "All":
    default:
      return "ALL";
  }
}

function categoryToDisplayValue(
  category: string,
): string {
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

export default function Portfolio() {
  const [active, setActive] =
    useState<Category>("All");

  const [items, setItems] =
    useState<GalleryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/gallery?take=12",
            {
              method: "GET",
              cache: "no-store",
            },
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load gallery.",
          );
        }

        const data =
          await response.json();

        if (!cancelled) {
          setItems(
            Array.isArray(data.items)
              ? data.items
              : [],
          );
        }
      } catch (error) {
        console.error(
          "Homepage gallery loading failed:",
          error,
        );

        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered =
    active === "All"
      ? items
      : items.filter(
          (item) =>
            item.category ===
            categoryToApiValue(active),
        );

  return (
    <section
      id="portfolio"
      data-testid="portfolio-section"
      className="relative py-32"
    >
      <div className="container">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">
              Chapter 01 · Portfolio
            </p>

            <h2 className="font-serif text-4xl md:text-6xl leading-[0.95] max-w-2xl text-balance">
              A quiet archive of loud,
              luminous days.
            </h2>
          </div>

          <Link
            href="/portfolio"
            data-testid="cta-portfolio-all"
            className="text-xs tracking-[0.24em] uppercase text-accent hover:underline underline-offset-8 decoration-1"
          >
            View full archive →
          </Link>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(
            (category) => (
              <button
                key={category}
                data-testid={`portfolio-filter-${category.toLowerCase()}`}
                onClick={() =>
                  setActive(category)
                }
                className={cn(
                  "rounded-full border px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors",

                  active === category
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent",
                )}
              >
                {category}
              </button>
            ),
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[260px] gap-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-sm bg-secondary animate-pulse",
                  index === 0 ||
                    index === 3 ||
                    index === 6
                    ? "row-span-2"
                    : "",
                )}
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          filtered.length === 0 && (
            <div className="py-20 text-center border border-border rounded-sm">
              <p className="text-muted-foreground">
                Our portfolio is being
                curated — check back
                soon.
              </p>
            </div>
          )}

        {/* GALLERY */}
        {!loading &&
          filtered.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[260px] gap-4">
              {filtered
                .slice(0, 8)
                .map(
                  (item, index) => {
                    /*
                     * Keep the same visual
                     * masonry-style emphasis
                     * as the original homepage.
                     */
                    const span =
                      index === 0 ||
                      index === 3 ||
                      index === 6
                        ? "row-span-2"
                        : "";

                    const imageSource =
                      item.thumbnail ||
                      item.url;

                    return (
                      <motion.figure
                        key={item.id}
                        layout
                        initial={{
                          opacity: 0,
                          y: 30,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                          margin:
                            "-80px",
                        }}
                        transition={{
                          duration: 0.7,
                          delay:
                            index *
                            0.05,
                        }}
                        className={cn(
                          "group relative overflow-hidden rounded-sm bg-secondary",
                          span,
                        )}
                      >
                        {/* IMAGE */}
                        {item.mediaType ===
                        "VIDEO" ? (
                          <>
                            <video
                              src={
                                item.url
                              }
                              poster={
                                item.thumbnail ||
                                undefined
                              }
                              muted
                              playsInline
                              preload="metadata"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                            />

                            <div className="absolute inset-0 grid place-items-center pointer-events-none">
                              <div className="h-12 w-12 rounded-full bg-black/50 backdrop-blur-sm grid place-items-center text-white">
                                <span className="text-sm">
                                  ▶
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <Image
                            src={
                              imageSource
                            }
                            alt={
                              item.title
                            }
                            fill
                            sizes="(min-width:768px) 25vw, 50vw"
                            className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                          />
                        )}

                        {/* GRADIENT */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

                        {/* CAPTION */}
                        <figcaption className="absolute inset-x-0 bottom-0 p-5 z-10 text-white">
                          <p className="text-[10px] tracking-[0.3em] uppercase opacity-70">
                            {categoryToDisplayValue(
                              item.category,
                            )}
                          </p>

                          <p className="font-serif text-lg mt-1">
                            {
                              item.title
                            }
                          </p>
                        </figcaption>
                      </motion.figure>
                    );
                  },
                )}
            </div>
          )}
      </div>
    </section>
  );
}