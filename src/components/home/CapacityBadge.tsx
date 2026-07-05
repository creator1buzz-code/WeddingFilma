"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Capacity = { year: number; totalSlots: number; booked: number; remaining: number };

export default function CapacityBadge() {
  const currentYear = new Date().getFullYear();
  // Sensible default so widget appears on first paint; hydrated with real data after fetch.
  const [c, setC] = useState<Capacity>({ year: currentYear, totalSlots: 12, booked: 9, remaining: 3 });

  useEffect(() => {
    fetch("/api/capacity")
      .then((r) => r.json())
      .then((d) => setC(d))
      .catch(() => {});
  }, []);

  const soldOut = c.remaining <= 0;
  const percent = Math.round((c.booked / c.totalSlots) * 100);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      data-testid="capacity-badge"
      className="hidden md:block absolute right-6 md:right-12 top-28 md:top-32 z-20"
    >
      <Link
        href={soldOut ? "/contact" : "/booking"}
        className="group block w-[260px] rounded-sm p-6 bg-accent text-accent-foreground hover:brightness-110 transition-all shadow-2xl shadow-black/60"
        data-testid="capacity-badge-link"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inset-0 rounded-full ${soldOut ? "bg-red-900" : "bg-accent-foreground"} animate-ping opacity-60`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${soldOut ? "bg-red-900" : "bg-accent-foreground"}`} />
          </span>
          <p className="text-[10px] tracking-[0.3em] uppercase text-accent-foreground/80">
            {soldOut ? "Waitlist open" : "Reserving now"}
          </p>
        </div>

        <p className="font-serif text-4xl leading-none text-accent-foreground">
          {soldOut ? (
            <>Full for <em className="italic">{c.year}</em></>
          ) : (
            <>
              <span>{c.remaining}</span>
              <span className="text-accent-foreground/50 text-2xl"> / {c.totalSlots}</span>
            </>
          )}
        </p>
        <p className="text-[11px] tracking-[0.24em] uppercase text-accent-foreground/70 mt-3">
          {soldOut ? `Join ${c.year + 1} list` : `Dates left in ${c.year}`}
        </p>

        <div className="mt-4 h-px w-full bg-accent-foreground/20 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1.4, delay: 1.4, ease: "easeOut" }}
            className="h-full bg-accent-foreground"
          />
        </div>

        <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-accent-foreground/90 group-hover:tracking-[0.28em] transition-all">
          {soldOut ? "Join waitlist →" : "Reserve your date →"}
        </p>
      </Link>
    </motion.div>
  );
}
