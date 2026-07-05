"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const services = [
  { title: "Wedding Photography", tag: "Heirloom", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" },
  { title: "Wedding Films", tag: "Cinema", img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80" },
  { title: "Pre-Wedding Shoots", tag: "Editorial", img: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80" },
  { title: "Child Photography", tag: "Tender", img: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1200&q=80" },
  { title: "Maternity Photography", tag: "Portrait", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80" },
  { title: "Corporate Films", tag: "Brand", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80" },
  { title: "Product Videos", tag: "Craft", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80" },
  { title: "Event Coverage", tag: "Live", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80" },
];

export default function Services() {
  return (
    <section data-testid="services-section" className="relative py-32 bg-secondary/40">
      <div className="container">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Chapter 05 · Services</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[0.95]">
              Craft for every chapter.
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              data-testid={`service-${i}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary"
            >
              <Image src={s.img} alt={s.title} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                <span className="self-start text-[10px] tracking-[0.3em] uppercase px-3 py-1 rounded-full border border-white/30">{s.tag}</span>
                <div className="flex items-end justify-between">
                  <h3 className="font-serif text-2xl leading-tight">{s.title}</h3>
                  <ArrowUpRight className="h-5 w-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <Link href="/booking" aria-label={s.title} className="absolute inset-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
