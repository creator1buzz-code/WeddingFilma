import { prisma } from "@/lib/prisma";

async function getBookings() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) return [];
  return prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
}

export default async function BookingsPage() {
  const bookings = await getBookings();
  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-4xl">Bookings</h1>
        <a href="/api/bookings/export" className="rounded-full border border-border px-5 py-2 text-xs tracking-[0.24em] uppercase hover:border-accent">Export CSV</a>
      </div>

      <div className="rounded-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs tracking-[0.24em] uppercase text-muted-foreground bg-secondary/60">
            <tr>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Client</th>
              <th className="text-left px-4 py-3">Event</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">No bookings yet.</td></tr>
            )}
            {bookings.map((b: any) => (
              <tr key={b.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-4 py-3 font-mono text-accent">{b.bookingCode}</td>
                <td className="px-4 py-3">{b.fullName}<br/><span className="text-xs text-muted-foreground">{b.email} · {b.phone}</span></td>
                <td className="px-4 py-3">{b.eventType}</td>
                <td className="px-4 py-3">{new Date(b.eventDate).toDateString()}</td>
                <td className="px-4 py-3">{b.city}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-secondary">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
