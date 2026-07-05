"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      data-testid="site-nav"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass" : "bg-transparent",
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2" data-testid="brand-logo">
          <span className="font-serif text-2xl tracking-tight">WeddingFilma</span>
          <span className="text-[10px] tracking-[0.4em] text-accent uppercase">India</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={cn(
                "text-sm uppercase tracking-[0.24em] transition-colors",
                pathname === n.href ? "text-accent" : "text-foreground/70 hover:text-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/booking"
            data-testid="cta-book-nav"
            className="hidden md:inline-flex items-center rounded-full border border-accent px-5 py-2 text-xs uppercase tracking-[0.24em] text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Book Your Shoot
          </Link>
          <button
            className="md:hidden h-9 w-9 grid place-items-center"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <div className="container py-6 flex flex-col gap-5">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.24em] text-foreground/80"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="inline-flex w-fit rounded-full border border-accent px-5 py-2 text-xs uppercase tracking-[0.24em] text-accent"
              >
                Book Your Shoot
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
