"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Weddings", "Pre-Wedding", "Child", "Maternity", "Corporate", "Event"] as const;

const ITEMS = [
  { id: "1", cat: "Weddings", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85", title: "Anaya & Rohan · Jaipur", tags: ["mahal", "sunset"] },
  { id: "2", cat: "Pre-Wedding", src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&q=85", title: "Kyra & Aarav · Udaipur", tags: ["lake"] },
  { id: "3", cat: "Child", src: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1600&q=85", title: "Little Vihaan", tags: ["studio"] },
  { id: "4", cat: "Weddings", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=85", title: "Meera & Aditya · Goa", tags: ["beach"] },
  { id: "5", cat: "Corporate", src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=85", title: "Tata Neu · Brand Film", tags: ["brand"] },
  { id: "6", cat: "Weddings", src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=85", title: "Ishita & Karan · Delhi", tags: ["haldi"] },
  { id: "7", cat: "Pre-Wedding", src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1600&q=85", title: "Zoya & Ved · Ladakh", tags: ["mountains"] },
  { id: "8", cat: "Child", src: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1600&q=85", title: "Maya · First birthday", tags: ["family"] },
  { id: "9", cat: "Maternity", src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1600&q=85", title: "Ananya · Second trimester", tags: ["portrait"] },
  { id: "10", cat: "Event", src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=85", title: "TEDx Bengaluru", tags: ["stage"] },
  { id: "11", cat: "Weddings", src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=85", title: "Priya & Rajat · Udaipur", tags: ["fireworks"] },
  { id: "12", cat: "Pre-Wedding", src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=85", title: "Rhea & Vivaan · Alibaug", tags: ["coast"] },
];

export default function PortfolioClient() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [count, setCount] = useState(9);

  const filtered = useMemo(() => {
    const list = ITEMS.filter((i) => (cat === "All" ? true : i.cat === cat));
    return q ? list.filter((i) => (i.title + " " + i.tags.join(" ")).toLowerCase().includes(q.toLowerCase())) : list;
  }, [cat, q]);

  const visible = filtered.slice(0, count);
  const active = ITEMS.find((i) => i.id === open) ?? null;

  return (
    <div className="pt-32 pb-24">
      <div className="container">
        <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Portfolio Archive</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] max-w-4xl text-balance">
          Every story, on a single page.
        </h1>

        <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors",
                  cat === c
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search titles or tags…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-full bg-transparent text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {visible.map((it) => (
            <motion.figure
              key={it.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-sm cursor-zoom-in"
              onClick={() => setOpen(it.id)}
            >
              <Image src={it.src} alt={it.title} width={1000} height={1500} sizes="(min-width:1024px) 33vw, 100vw" className="w-full h-auto transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <p className="text-[10px] tracking-[0.3em] uppercase opacity-70">{it.cat}</p>
                <p className="font-serif text-lg mt-1">{it.title}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {visible.length < filtered.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setCount((c) => c + 6)}
              className="rounded-full border border-accent px-8 py-4 text-xs tracking-[0.24em] uppercase text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Load more
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">No stories match yet — try a different filter.</p>
        )}

        <div className="mt-24 border-t border-border pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-3xl md:text-4xl max-w-lg text-balance">Have a story of your own?</p>
          <Link href="/booking" className="rounded-full bg-accent text-accent-foreground px-8 py-4 text-xs tracking-[0.24em] uppercase">Book your shoot →</Link>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md p-4 grid place-items-center"
            onClick={() => setOpen(null)}
          >
            <button className="absolute top-6 right-6 h-11 w-11 grid place-items-center rounded-full border border-border" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full aspect-[3/2]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={active.src} alt={active.title} fill className="object-contain" />
              <p className="absolute bottom-4 left-4 right-4 font-serif text-xl text-accent">{active.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
