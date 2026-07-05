import type { MetadataRoute } from "next";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://weddingfilma.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site}/booking`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
