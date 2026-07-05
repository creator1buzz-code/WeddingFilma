import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding WeddingFilma sample data …");

  // Packages
  await prisma.package.createMany({
    data: [
      {
        name: "Reel", slug: "reel", tagline: "Essentials",
        description: "For the intimate wedding — two days, two artists.",
        priceFrom: 195000, duration: "2 days",
        includes: ["1 cinematographer", "1 photographer", "Highlight film 3-4 min", "300 edited photos"],
      },
      {
        name: "Signature", slug: "signature", tagline: "Most loved",
        description: "The complete wedding chronicle across ceremonies.",
        priceFrom: 495000, duration: "4 days",
        includes: ["2 cinematographers", "2 photographers", "Drone aerial", "Highlight + Feature film", "800 edited photos", "Printed album"],
        popular: true,
      },
      {
        name: "Heirloom", slug: "heirloom", tagline: "Destination",
        description: "Travel included. Cinema-grade, curated for a decade of watching.",
        priceFrom: 995000, duration: "5+ days",
        includes: ["3 cinematographers", "3 photographers", "Drone + Gimbal", "Same-day edit", "Feature film 15+ min", "Coffee-table album"],
      },
    ],
    skipDuplicates: true,
  });

  // Testimonials
  await prisma.testimonial.createMany({
    data: [
      { name: "Anaya Malhotra", location: "Jaipur", eventType: "WEDDING", rating: 5, quote: "They didn't shoot a wedding — they wrote a film. Every time we watch it we find a new moment.", featured: true },
      { name: "Rhea Iyer", location: "Bengaluru", eventType: "PRE_WEDDING", rating: 5, quote: "Impossibly patient, breathtakingly creative. Our pre-wedding felt like a postcard from Wes Anderson.", featured: true },
      { name: "The Kapoor Family", location: "Mumbai", eventType: "CHILD", rating: 5, quote: "They captured our daughter's first year with such tenderness. These frames are heirlooms now.", featured: true },
    ],
    skipDuplicates: true,
  });

  // Gallery samples
  const items = [
    { title: "Anaya & Rohan · Jaipur", category: "WEDDINGS", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600", featured: true },
    { title: "Meera & Aditya · Goa", category: "WEDDINGS", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600" },
    { title: "Kyra & Aarav · Udaipur", category: "PRE_WEDDING", url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600" },
    { title: "Little Vihaan", category: "CHILD", url: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1600" },
    { title: "Ananya · Second trimester", category: "MATERNITY", url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1600" },
    { title: "Tata Neu · Brand Film", category: "CORPORATE", url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600" },
  ];
  for (const it of items) {
    await prisma.galleryItem.create({ data: { ...it, category: it.category as any } });
  }

  console.log("✔ Seed complete");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
