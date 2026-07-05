"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "How far in advance should we book?", a: "We accept only twelve weddings a year. Most couples book 6-10 months ahead; destination weddings we recommend a year in advance." },
  { q: "Do you travel for destination weddings?", a: "Yes — India-wide and worldwide. Travel, boarding and equipment logistics are included in destination packages." },
  { q: "What is the delivery timeline?", a: "Highlight film in 14 days, feature film in 30 days, complete edited photo gallery in 45 days. All in 4K and archival RAW." },
  { q: "Can we customise a package?", a: "Every wedding is different. After a discovery call our creative director builds a package that fits your ceremonies, budget and story." },
  { q: "Do you shoot on film?", a: "For select couples, yes — Portra 400 and Ektachrome on Contax and Pentax medium format." },
  { q: "What about drones and aerial coverage?", a: "We have DGCA-licensed pilots on every wedding. Aerial coverage is included in the Signature and Heirloom packages." },
];

export default function FAQ() {
  return (
    <section data-testid="faq-section" className="relative py-32">
      <div className="container grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Chapter 06 · FAQ</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl leading-[1] text-balance"
          >
            Small print, <em className="italic text-accent">answered honestly.</em>
          </motion.h2>
        </div>
        <div className="md:col-span-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-${i}`}>
                <AccordionTrigger className="font-serif text-lg md:text-xl text-left hover:text-accent">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
