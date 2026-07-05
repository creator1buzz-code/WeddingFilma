import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

async function get() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) return [];
  return prisma.package.findMany({ orderBy: { priceFrom: "asc" } });
}

export default async function AdminPackagesPage() {
  const items = await get();
  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-4xl">Packages</h1>
        <button className="rounded-full bg-accent text-accent-foreground px-5 py-2 text-xs tracking-[0.24em] uppercase">+ New package</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.length === 0 && <p className="text-muted-foreground">No packages yet. Seed the database to see samples.</p>}
        {items.map((p: any) => (
          <div key={p.id} className="rounded-sm border border-border p-6 bg-card">
            <p className="text-[11px] tracking-[0.3em] uppercase text-accent">{p.tagline}</p>
            <h3 className="font-serif text-2xl mt-2">{p.name}</h3>
            <p className="mt-3 text-3xl font-serif">{formatINR(p.priceFrom)}</p>
            <p className="mt-2 text-xs text-muted-foreground">{p.duration}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {p.includes.map((i: string) => <li key={i} className="text-muted-foreground">· {i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
