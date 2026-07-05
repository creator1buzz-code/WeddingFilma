"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

const FILMS = [
  { id: "1", couple: "Anaya × Rohan", place: "Jaipur, Rajasthan", runtime: "6:24", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=80" },
  { id: "2", couple: "Meera × Aditya", place: "Goa Coastline", runtime: "5:41", cover: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=2000&q=80" },
  { id: "3", couple: "Zoya × Ved", place: "Ladakh Highlands", runtime: "7:12", cover: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=2000&q=80" },
];

export default function FeaturedFilms() {
  const [i, setI] = useState(0);
  const film = FILMS[i];

  return (
    <section data-testid="featured-films" className="relative py-32 bg-secondary/40">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Chapter 02 · Featured Films</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[0.95] max-w-3xl">
              Cinema, not montages.
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => setI((v) => (v - 1 + FILMS.length) % FILMS.length)}
              className="h-11 w-11 grid place-items-center rounded-full border border-border hover:border-accent"
              aria-label="Previous"
              data-testid="films-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setI((v) => (v + 1) % FILMS.length)}
              className="h-11 w-11 grid place-items-center rounded-full border border-border hover:border-accent"
              aria-label="Next"
              data-testid="films-next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/9] rounded-sm overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={film.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image src={film.cover} alt={film.couple} fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 text-white z-10">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.4em] uppercase opacity-80">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Film Reel · Vol. {String(i + 1).padStart(2, "0")}
            </div>

            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase opacity-70">{film.place}</p>
                <h3 className="font-serif text-4xl md:text-6xl mt-3">{film.couple}</h3>
                <p className="mt-3 text-sm opacity-70">Runtime · {film.runtime}</p>
              </div>
              <button
                data-testid="film-play"
                aria-label={`Play ${film.couple}`}
                className="h-16 w-16 md:h-24 md:w-24 grid place-items-center rounded-full bg-accent text-accent-foreground hover:scale-105 transition-transform"
              >
                <Play className="h-6 w-6 md:h-8 md:w-8 ml-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {FILMS.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setI(idx)}
              className={`h-0.5 flex-1 transition-colors ${idx === i ? "bg-accent" : "bg-border"}`}
              aria-label={`Film ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
