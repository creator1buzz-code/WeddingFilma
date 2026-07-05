"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Weddings", "Pre-Wedding", "Child", "Corporate"] as const;
type Cat = (typeof CATEGORIES)[number];

const ITEMS: { id: string; cat: Exclude<Cat, "All">; src: string; span: string; title: string }[] = [
  { id: "1", cat: "Weddings", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", span: "row-span-2", title: "Anaya & Rohan · Jaipur" },
  { id: "2", cat: "Pre-Wedding", src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80", span: "", title: "Kyra & Aarav · Udaipur" },
  { id: "3", cat: "Child", src: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&q=80", span: "", title: "Little Vihaan" },
  { id: "4", cat: "Weddings", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80", span: "row-span-2", title: "Meera & Aditya · Goa" },
  { id: "5", cat: "Corporate", src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", span: "", title: "Tata Neu · Brand Film" },
  { id: "6", cat: "Weddings", src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", span: "", title: "Ishita & Karan · Delhi" },
  { id: "7", cat: "Pre-Wedding", src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80", span: "row-span-2", title: "Zoya & Ved · Ladakh" },
  { id: "8", cat: "Child", src: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80", span: "", title: "Maya · First birthday" },
];

export default function Portfolio() {
  const [active, setActive] = useState<Cat>("All");
  const filtered = active === "All" ? ITEMS : ITEMS.filter((i) => i.cat === active);

  return (
    <section id="portfolio" data-testid="portfolio-section" className="relative py-32">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Chapter 01 · Portfolio</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[0.95] max-w-2xl text-balance">
              A quiet archive of loud, luminous days.
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

        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              data-testid={`portfolio-filter-${c.toLowerCase()}`}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors",
                active === c
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[260px] gap-4">
          {filtered.map((it, i) => (
            <motion.figure
              key={it.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className={cn(
                "group relative overflow-hidden rounded-sm bg-secondary",
                it.span,
              )}
            >
              <Image
                src={it.src}
                alt={it.title}
                fill
                sizes="(min-width:768px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 z-10 text-white">
                <p className="text-[10px] tracking-[0.3em] uppercase opacity-70">{it.cat}</p>
                <p className="font-serif text-lg mt-1">{it.title}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
