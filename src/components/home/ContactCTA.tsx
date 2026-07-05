"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section data-testid="contact-cta" className="relative overflow-hidden py-32">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=2000&q=80"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-4xl"
        >
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-6">The Final Chapter</p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance">
            Ready to write yours <em className="italic text-accent">with us</em>?
          </h2>
          <p className="mt-8 text-muted-foreground max-w-xl">
            Twelve weddings a year. A studio you'll want to keep on speed dial for a lifetime.
            Share your date — we'll respond within 24 hours.
          </p>
          <div className="mt-12 flex flex-wrap gap-5">
            <Link
              href="/booking"
              data-testid="cta-book-footer"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm tracking-[0.2em] uppercase text-accent-foreground hover:bg-accent/90"
            >
              Book Your Shoot
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="mailto:bookings@weddingfilma.in"
              className="inline-flex items-center gap-3 rounded-full border border-foreground/30 px-8 py-4 text-sm tracking-[0.2em] uppercase hover:border-accent hover:text-accent"
            >
              bookings@weddingfilma.in
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
