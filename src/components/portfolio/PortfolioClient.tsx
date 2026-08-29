"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Weddings",
  "Pre-Wedding",
  "Child",
  "Maternity",
  "Corporate",
  "Event",
] as const;

type Category = (typeof CATEGORIES)[number];

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

    case "Maternity":
      return "MATERNITY";

    case "Corporate":
      return "CORPORATE";

    case "Event":
      return "EVENT";

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

export default function PortfolioClient() {
  const [cat, setCat] =
    useState<Category>("All");

  const [q, setQ] =
    useState("");

  const [open, setOpen] =
    useState<string | null>(null);

  const [count, setCount] =
    useState(9);

  const [items, setItems] =
    useState<GalleryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Load gallery items from the database.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/gallery?take=100",
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
      } catch (err) {
        console.error(
          "Portfolio gallery loading failed:",
          err,
        );

        if (!cancelled) {
          setError(
            "Unable to load the portfolio right now.",
          );

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

  /*
   * Filter by category and search query.
   */
  const filtered = useMemo(() => {
    const apiCategory =
      categoryToApiValue(cat);

    let list =
      apiCategory === "ALL"
        ? items
        : items.filter(
            (item) =>
              item.category ===
              apiCategory,
          );

    const search =
      q.trim().toLowerCase();

    if (search) {
      list = list.filter((item) => {
        const searchableText =
          [
            item.title,
            item.description ?? "",
            item.category,
            categoryToDisplayValue(
              item.category,
            ),
            ...(Array.isArray(
              item.tags,
            )
              ? item.tags
              : []),
          ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(
          search,
        );
      });
    }

    return list;
  }, [items, cat, q]);

  /*
   * Items currently visible.
   */
  const visible =
    filtered.slice(0, count);

  /*
   * Currently opened lightbox item.
   */
  const active =
    items.find(
      (item) =>
        item.id === open,
    ) ?? null;

  /*
   * Reset pagination when changing
   * category or search.
   */
  useEffect(() => {
    setCount(9);
  }, [cat, q]);

  /*
   * Close lightbox with Escape.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
      ) {
        setOpen(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open]);

  return (
    <div className="pt-32 pb-24">
      <div className="container">
        {/* HEADER */}
        <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">
          Portfolio Archive
        </p>

        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] max-w-4xl text-balance">
          Every story, on a single page.
        </h1>

        {/* FILTERS + SEARCH */}
        <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(
              (category) => (
                <button
                  key={category}
                  onClick={() =>
                    setCat(category)
                  }
                  className={cn(
                    "rounded-full border px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors",

                    cat === category
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent",
                  )}
                >
                  {category}
                </button>
              ),
            )}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              placeholder="Search titles or tags…"
              value={q}
              onChange={(event) =>
                setQ(
                  event.target.value,
                )
              }
              className="w-full pl-10 pr-4 py-2 border border-border rounded-full bg-transparent text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] rounded-sm bg-secondary animate-pulse"
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              {error}
            </p>
          </div>
        )}

        {/* GALLERY */}
        {!loading &&
          !error &&
          visible.length > 0 && (
            <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
              {visible.map(
                (item) => {
                  const imageSource =
                    item.thumbnail ||
                    item.url;

                  return (
                    <motion.figure
                      key={item.id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.6,
                      }}
                      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-sm cursor-zoom-in bg-secondary"
                      onClick={() =>
                        setOpen(
                          item.id,
                        )
                      }
                    >
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
                            className="w-full h-auto block transition-transform duration-1000 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 grid place-items-center pointer-events-none">
                            <div className="h-14 w-14 rounded-full bg-black/50 backdrop-blur-sm grid place-items-center text-white">
                              <Play
                                className="h-5 w-5 ml-1"
                                fill="currentColor"
                              />
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
                          width={1000}
                          height={1500}
                          sizes="(min-width:1024px) 33vw, 100vw"
                          className="w-full h-auto transition-transform duration-1000 group-hover:scale-105"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
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

        {/* LOAD MORE */}
        {!loading &&
          !error &&
          visible.length <
            filtered.length && (
            <div className="mt-12 text-center">
              <button
                onClick={() =>
                  setCount(
                    (current) =>
                      current + 6,
                  )
                }
                className="rounded-full border border-accent px-8 py-4 text-xs tracking-[0.24em] uppercase text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Load more
              </button>
            </div>
          )}

        {/* EMPTY STATE */}
        {!loading &&
          !error &&
          filtered.length === 0 && (
            <div className="mt-20 text-center">
              <p className="text-muted-foreground">
                {items.length === 0
                  ? "Our portfolio is being curated — check back soon."
                  : "No stories match yet — try a different filter."}
              </p>
            </div>
          )}

        {/* CTA */}
        <div className="mt-24 border-t border-border pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-3xl md:text-4xl max-w-lg text-balance">
            Have a story of your own?
          </p>

          <Link
            href="/booking"
            className="rounded-full bg-accent text-accent-foreground px-8 py-4 text-xs tracking-[0.24em] uppercase"
          >
            Book your shoot →
          </Link>
        </div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md p-4 grid place-items-center"
            onClick={() =>
              setOpen(null)
            }
          >
            {/* CLOSE */}
            <button
              className="absolute top-6 right-6 h-11 w-11 grid place-items-center rounded-full border border-border bg-background/60 z-20"
              aria-label="Close"
              onClick={() =>
                setOpen(null)
              }
            >
              <X className="h-4 w-4" />
            </button>

            <motion.div
              initial={{
                scale: 0.96,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              className="relative max-w-5xl w-full max-h-[90vh] aspect-[3/2]"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {active.mediaType ===
              "VIDEO" ? (
                <video
                  src={active.url}
                  poster={
                    active.thumbnail ||
                    undefined
                  }
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={
                    active.url
                  }
                  alt={
                    active.title
                  }
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              )}

              <p className="absolute bottom-4 left-4 right-4 font-serif text-xl text-accent pointer-events-none">
                {active.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}