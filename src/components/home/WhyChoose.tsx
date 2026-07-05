"use client";

import { motion } from "framer-motion";
import { Users, Film, Plane, Video, Clock, Sparkles, Compass } from "lucide-react";

const reasons = [
  { icon: Users, title: "A tight, experienced crew", desc: "Cinematographers, colourists & editors who've told 400+ stories together." },
  { icon: Film, title: "Cinematic story-first edit", desc: "Every film is scored, colour-graded and paced like a feature." },
  { icon: Plane, title: "Drone & aerial coverage", desc: "Licensed pilots for sweeping mahal and coastline vistas." },
  { icon: Video, title: "4K/8K delivery", desc: "Broadcast-quality masters archived for a lifetime." },
  { icon: Clock, title: "Four-week turnaround", desc: "Highlight in 14 days, feature film in a month. Guaranteed." },
  { icon: Sparkles, title: "Creative direction", desc: "Moodboards, wardrobe notes, location scouting — included." },
  { icon: Compass, title: "Destination expertise", desc: "Udaipur, Goa, Jaipur, Bali, Tuscany, Mauritius. Passports ready." },
];

export default function WhyChoose() {
  return (
    <section data-testid="why-choose" className="relative py-32">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Chapter 04 · The Studio</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1] text-balance">
              Why couples choose <em className="italic text-accent">WeddingFilma</em>.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-sm">
              We're small on purpose. Only twelve weddings a year — because craft demands
              devotion.
            </p>
          </div>

          <ul className="md:col-span-8 grid sm:grid-cols-2 gap-px bg-border rounded-sm overflow-hidden">
            {reasons.map((r, i) => (
              <motion.li
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="bg-card p-8 hover:bg-secondary/50 transition-colors"
                data-testid={`reason-${i}`}
              >
                <r.icon className="h-6 w-6 text-accent mb-5" strokeWidth={1.25} />
                <h3 className="font-serif text-xl">{r.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground text-pretty">{r.desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
