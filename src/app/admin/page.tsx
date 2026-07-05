import { prisma } from "@/lib/prisma";
import { CalendarDays, Sparkles, Users, IndianRupee } from "lucide-react";

async function getStats() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) {
    return { bookings: 0, upcoming: 0, clients: 0, revenue: 0, latest: [] as any[] };
  }
  const [bookings, upcoming, clients, latest] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { eventDate: { gte: new Date() }, status: { in: ["CONFIRMED", "IN_PROGRESS"] } } }),
    prisma.profile.count({ where: { role: "CLIENT" } }),
    prisma.booking.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
  ]);
  return { bookings, upcoming, clients, revenue: 0, latest };
}

export default async function AdminDashboardPage() {
  const s = await getStats();
  const cards = [
    { l: "Total bookings", v: s.bookings, Icon: CalendarDays },
    { l: "Upcoming shoots", v: s.upcoming, Icon: Sparkles },
    { l: "Active clients", v: s.clients, Icon: Users },
    { l: "Revenue (INR)", v: "—", Icon: IndianRupee },
  ];
  return (
    <div className="p-10">
      <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-3">Console</p>
      <h1 className="font-serif text-4xl mb-10">Studio at a glance.</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-12">
        {cards.map((c) => (
          <div key={c.l} className="rounded-sm border border-border p-6 bg-card">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-[11px] tracking-[0.3em] uppercase">{c.l}</p>
              <c.Icon className="h-4 w-4 text-accent" />
            </div>
            <p className="font-serif text-4xl mt-4">{c.v}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-2xl mb-6">Latest booking requests</h2>
      <div className="rounded-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs tracking-[0.24em] uppercase text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Client</th>
              <th className="text-left px-4 py-3">Event</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {s.latest.length === 0 && (
              <tr><td className="px-4 py-6 text-muted-foreground" colSpan={5}>No bookings yet. Configure DATABASE_URL to see live data.</td></tr>
            )}
            {s.latest.map((b: any) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-accent">{b.bookingCode}</td>
                <td className="px-4 py-3">{b.fullName}<br/><span className="text-xs text-muted-foreground">{b.email}</span></td>
                <td className="px-4 py-3">{b.eventType}</td>
                <td className="px-4 py-3">{new Date(b.eventDate).toDateString()}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-secondary">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
