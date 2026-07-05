"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer data-testid="site-footer" className="border-t border-border mt-32">
      <div className="container py-20 grid gap-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-4xl leading-tight text-balance">
            Stories that outlive <em className="text-accent not-italic">the moment.</em>
          </p>
          <p className="mt-6 text-sm text-muted-foreground max-w-md">
            WeddingFilma is a boutique studio crafting cinematic films and heirloom
            photographs for weddings across India and beyond.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="h-10 w-10 grid place-items-center rounded-full border border-border hover:border-accent transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="h-10 w-10 grid place-items-center rounded-full border border-border hover:border-accent transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.24em] uppercase text-muted-foreground mb-5">Studio</p>
          <ul className="space-y-3 text-sm">
            <li><Link href="/portfolio" className="hover:text-accent">Portfolio</Link></li>
            <li><Link href="/about" className="hover:text-accent">About</Link></li>
            <li><Link href="/booking" className="hover:text-accent">Book a shoot</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.24em] uppercase text-muted-foreground mb-5">Reach us</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> bookings@weddingfilma.in</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +91 98XXX XXXXX</li>
            <li className="text-muted-foreground text-xs mt-4">Serving weddings PAN-India & destinations worldwide</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} WeddingFilma. Crafted with devotion.</p>
          <p className="tracking-[0.24em] uppercase">CIN · India</p>
        </div>
      </div>
    </footer>
  );
}
