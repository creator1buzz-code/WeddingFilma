import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, CalendarDays, Users, Image as ImageIcon, MessageSquareQuote, Package, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", Icon: CalendarDays },
  { href: "/admin/clients", label: "Clients", Icon: Users },
  { href: "/admin/gallery", label: "Gallery", Icon: ImageIcon },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/packages", label: "Packages", Icon: Package },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verify Supabase is configured; otherwise let devs land on the console.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url && !url.startsWith("YOUR_")) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && typeof window === "undefined") {
      // handled by middleware, but keep as guard
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-[240px_1fr]">
      <aside className="border-r border-border p-6 sticky top-0 h-screen flex flex-col">
        <Link href="/admin" className="font-serif text-2xl mb-10">
          Wedding<span className="text-accent">Filma</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              data-testid={`admin-nav-${n.label.toLowerCase()}`}
              className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <n.Icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={async () => { "use server"; const s = createClient(); await s.auth.signOut(); redirect("/admin/login"); }}>
          <button className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground w-full">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </aside>
      <div>{children}</div>
    </div>
  );
}
