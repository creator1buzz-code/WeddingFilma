"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const items = [
  {
    name: "Anaya Malhotra",
    location: "Jaipur",
    event: "Wedding",
    rating: 5,
    quote:
      "They didn't shoot a wedding — they wrote a film. Every time we watch it, we discover a new moment we didn't know we had.",
  },
  {
    name: "Rhea Iyer",
    location: "Bengaluru",
    event: "Pre-Wedding",
    rating: 5,
    quote:
      "Impossibly patient, breathtakingly creative. Our pre-wedding felt like a scene from a Wes Anderson postcard.",
  },
  {
    name: "The Kapoor Family",
    location: "Mumbai",
    event: "Child Photography",
    rating: 5,
    quote:
      "They captured our daughter's first year with such tenderness. These frames are heirlooms now.",
  },
];

export default function Testimonials() {
  return (
    <section data-testid="testimonials-section" className="relative py-32">
      <div className="container">
        <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Chapter 03 · Kind Words</p>
        <h2 className="font-serif text-4xl md:text-6xl leading-[0.95] max-w-3xl mb-16 text-balance">
          Told back to us in <em className="italic text-accent">whispers.</em>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              data-testid={`testimonial-${i}`}
              className="relative rounded-sm border border-border bg-card p-8 md:p-10"
            >
              <Quote className="h-8 w-8 text-accent/40 mb-6" />
              <p className="font-serif text-xl md:text-2xl leading-snug text-pretty">
                “{t.quote}”
              </p>
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.event} · {t.location}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
