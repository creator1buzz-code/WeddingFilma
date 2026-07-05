import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateCapacity(formData: FormData) {
  "use server";
  const year = Number(formData.get("year"));
  const totalSlots = Number(formData.get("totalSlots"));
  const booked = Number(formData.get("booked"));
  if (!year || Number.isNaN(totalSlots) || Number.isNaN(booked)) return;
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) return;
  await prisma.yearCapacity.upsert({
    where: { year },
    update: { totalSlots, booked },
    create: { year, totalSlots, booked },
  });
  revalidatePath("/admin/capacity");
  revalidatePath("/");
}

async function get() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) return [];
  const cur = new Date().getFullYear();
  await prisma.yearCapacity.upsert({ where: { year: cur }, update: {}, create: { year: cur } });
  return prisma.yearCapacity.findMany({ orderBy: { year: "asc" } });
}

export default async function AdminCapacityPage() {
  const rows = await get();
  const cur = new Date().getFullYear();

  return (
    <div className="p-10 max-w-3xl">
      <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-3">Scarcity engine</p>
      <h1 className="font-serif text-4xl mb-3">Year capacity</h1>
      <p className="text-muted-foreground mb-10 text-sm max-w-xl">
        Controls the "Reserve your date" widget on the homepage hero. Keep it truthful — it
        converts because couples believe it.
      </p>

      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="text-muted-foreground text-sm">Configure DATABASE_URL to manage capacity.</p>
        )}
        {rows.map((r: any) => (
          <form
            key={r.year}
            action={updateCapacity}
            className="grid grid-cols-[100px_1fr_1fr_auto] items-end gap-4 rounded-sm border border-border bg-card p-5"
          >
            <input type="hidden" name="year" value={r.year} />
            <div>
              <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground mb-1">Year</p>
              <p className="font-serif text-3xl">{r.year}{r.year === cur && <span className="text-xs text-accent ml-2">now</span>}</p>
            </div>
            <label className="text-sm">
              <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground block mb-1">Total slots</span>
              <input name="totalSlots" defaultValue={r.totalSlots} type="number" min={1}
                className="w-full bg-transparent border-b border-border py-2 text-base focus:outline-none focus:border-accent" />
            </label>
            <label className="text-sm">
              <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground block mb-1">Booked</span>
              <input name="booked" defaultValue={r.booked} type="number" min={0}
                className="w-full bg-transparent border-b border-border py-2 text-base focus:outline-none focus:border-accent" />
            </label>
            <button className="rounded-full bg-accent text-accent-foreground px-5 py-2 text-xs tracking-[0.24em] uppercase" data-testid={`save-capacity-${r.year}`}>Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}
