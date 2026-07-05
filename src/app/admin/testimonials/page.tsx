import { prisma } from "@/lib/prisma";

async function get() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) return [];
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
}

export default async function AdminTestimonialsPage() {
  const items = await get();
  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-4xl">Testimonials</h1>
        <button className="rounded-full bg-accent text-accent-foreground px-5 py-2 text-xs tracking-[0.24em] uppercase">+ Add testimonial</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.length === 0 && <p className="text-muted-foreground">No testimonials yet.</p>}
        {items.map((t: any) => (
          <div key={t.id} className="rounded-sm border border-border p-6 bg-card">
            <p className="font-serif text-lg">“{t.quote}”</p>
            <p className="mt-4 text-xs tracking-[0.24em] uppercase text-muted-foreground">{t.name} · {t.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
