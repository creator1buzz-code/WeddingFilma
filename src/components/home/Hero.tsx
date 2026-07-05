"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import CapacityBadge from "./CapacityBadge";

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen w-full overflow-hidden cinema-vignette"
    >
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=80"
          className="h-full w-full object-cover"
        >
          <source
            src="https://cdn.pixabay.com/video/2022/12/23/144207-782937232_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </div>

      {/* Editorial marker */}
      <div className="absolute left-6 top-24 md:left-12 md:top-32 z-10 hidden md:block">
        <div className="flex items-center gap-4">
          <div className="h-px w-16 bg-accent" />
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent">Est. India · Vol. XII</p>
        </div>
      </div>

      {/* Scarcity / capacity widget (replaces the corner tick) */}
      <CapacityBadge />

      {/* Center text */}
      <div className="relative z-10 container flex min-h-screen flex-col justify-center pt-24 pb-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-xs md:text-sm tracking-[0.4em] uppercase text-accent mb-6"
        >
          Cinematic Wedding Films · Photography · India
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25 }}
          className="font-serif text-5xl md:text-7xl lg:text-[8rem] leading-[0.95] tracking-tight text-balance max-w-5xl"
        >
          Love, framed like
          <br />
          <em className="text-accent italic font-normal">a film that lasts</em> forever.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-10 max-w-lg text-base md:text-lg text-muted-foreground text-pretty"
        >
          A boutique studio crafting heirloom photographs and cinematic wedding films for
          couples with taste — across India and beyond.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center gap-5"
        >
          <Link
            href="/booking"
            data-testid="cta-book-hero"
            className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm tracking-[0.2em] uppercase text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Book Your Shoot
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/portfolio"
            data-testid="cta-portfolio-hero"
            className="group inline-flex items-center gap-3 rounded-full border border-foreground/30 px-8 py-4 text-sm tracking-[0.2em] uppercase text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <Play className="h-4 w-4" />
            View Portfolio
          </Link>
        </motion.div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 inset-x-0 z-10 border-t border-foreground/10 bg-background/40 backdrop-blur-md overflow-hidden">
        <div className="marquee-track py-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-16 pr-16 shrink-0">
              {["Vogue Wedding Show", "Condé Nast Traveller", "WeddingSutra Editor's Pick", "Brides Today", "Featured on Netflix India", "Elle India"].map((t) => (
                <span key={t + i} className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground">
                  ✦ {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
