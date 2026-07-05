import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Studio",
  description: "Twelve weddings a year. A boutique studio devoted to cinematic wedding films and heirloom photography.",
};

const team = [
  { name: "Aarav Menon", role: "Creative Director", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80" },
  { name: "Sana Iyer", role: "Lead Cinematographer", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" },
  { name: "Kabir Rao", role: "Colourist", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80" },
];

const process = [
  { n: "01", t: "Discovery call", d: "Thirty minutes to hear your story, ceremonies and pace." },
  { n: "02", t: "Creative brief", d: "Moodboards, wardrobe notes, colour direction — approved by you." },
  { n: "03", t: "Location scout", d: "We visit or study every venue in advance. Nothing is left to chance." },
  { n: "04", t: "Cinema-grade shoot", d: "Two cinematographers, two photographers, one drone pilot per day." },
  { n: "05", t: "Studio edit", d: "Scored, colour graded, paced like a film. 14-day highlight guarantee." },
  { n: "06", t: "Delivery", d: "4K masters, archival RAW, and a printed keepsake album." },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-14 items-end">
          <div className="md:col-span-7">
            <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">The Studio</p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance">
              Small by choice. Devotional by design.
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl text-pretty">
              WeddingFilma is a boutique studio of twelve. We take on only twelve weddings a
              year — because a wedding film worth watching in twenty years takes twenty
              hands and one soul.
            </p>
          </div>
          <div className="md:col-span-5 relative aspect-[4/5] rounded-sm overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85" alt="Studio" fill className="object-cover" />
          </div>
        </div>

        <section className="mt-32">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Our process</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-16">Six rooms, one story.</h2>
          <div className="grid md:grid-cols-3 gap-px bg-border rounded-sm overflow-hidden">
            {process.map((p) => (
              <div key={p.n} className="bg-card p-10">
                <p className="font-serif text-5xl text-accent">{p.n}</p>
                <h3 className="font-serif text-xl mt-6">{p.t}</h3>
                <p className="mt-3 text-sm text-muted-foreground text-pretty">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-32">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">The people</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-16">Twelve hands, one heart.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((m) => (
              <div key={m.name}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                  <Image src={m.img} alt={m.name} fill className="object-cover" />
                </div>
                <h3 className="font-serif text-xl mt-4">{m.name}</h3>
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-32 border-t border-border pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-3xl md:text-4xl">Twelve dates a year. One might be yours.</p>
          <Link href="/booking" className="rounded-full bg-accent text-accent-foreground px-8 py-4 text-xs tracking-[0.24em] uppercase">Book your shoot →</Link>
        </div>
      </div>
    </div>
  );
}
