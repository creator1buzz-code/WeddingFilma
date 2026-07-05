"use client";

import Image from "next/image";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";

const posts = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
];

export default function InstagramFeed() {
  return (
    <section data-testid="instagram-section" className="relative py-32 border-t border-border">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Chapter 07 · Instagram</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[0.95]">Follow the reel.</h2>
          </div>
          <a
            href="https://instagram.com/weddingfilma"
            className="text-xs tracking-[0.24em] uppercase text-accent flex items-center gap-2 hover:underline underline-offset-8"
            data-testid="instagram-follow"
          >
            <Instagram className="h-4 w-4" /> @weddingfilma
          </a>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {posts.map((src, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/weddingfilma"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative aspect-square overflow-hidden group"
            >
              <Image src={src} alt="Instagram" fill sizes="16vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors grid place-items-center">
                <Instagram className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
