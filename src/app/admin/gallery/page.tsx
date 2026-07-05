import { prisma } from "@/lib/prisma";

async function get() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("YOUR_")) return [];
  return prisma.galleryItem.findMany({ orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }], take: 100 });
}

export default async function AdminGalleryPage() {
  const items = await get();
  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-4xl">Gallery</h1>
        <button className="rounded-full bg-accent text-accent-foreground px-5 py-2 text-xs tracking-[0.24em] uppercase">+ Upload media</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.length === 0 && (
          <p className="col-span-full text-muted-foreground">No media uploaded yet. Configure Supabase Storage and add gallery items.</p>
        )}
        {items.map((i: any) => (
          <div key={i.id} className="relative aspect-[3/4] rounded-sm overflow-hidden bg-secondary">
            <img src={i.thumbnail || i.url} alt={i.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs">
              <p className="uppercase tracking-[0.2em] opacity-70">{i.category}</p>
              <p className="font-serif">{i.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
