import { prisma } from "@/lib/prisma";

async function get() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) return [];
  return prisma.profile.findMany({ where: { role: "CLIENT" }, orderBy: { createdAt: "desc" }, take: 50 });
}

export default async function AdminClientsPage() {
  const items = await get();
  return (
    <div className="p-10">
      <h1 className="font-serif text-4xl mb-10">Clients</h1>
      <div className="rounded-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs tracking-[0.24em] uppercase text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">No clients yet.</td></tr>
            )}
            {items.map((c: any) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3">{c.fullName ?? "—"}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.phone ?? "—"}</td>
                <td className="px-4 py-3">{new Date(c.createdAt).toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
