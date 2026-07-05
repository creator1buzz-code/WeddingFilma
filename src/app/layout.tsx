import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://weddingfilma.in";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "WeddingFilma — Cinematic Wedding Films & Photography, India",
    template: "%s · WeddingFilma",
  },
  description:
    "Cinematic wedding films and heirloom photography across India. Destination-ready storytellers for weddings, pre-weddings, maternity, children and brand films.",
  openGraph: {
    type: "website",
    url: site,
    siteName: "WeddingFilma",
    title: "WeddingFilma — Cinematic Wedding Films & Photography",
    description:
      "Destination-ready storytellers crafting cinematic wedding films & heirloom photography across India.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WeddingFilma — Cinematic Wedding Films",
    description: "Cinematic wedding films & heirloom photography across India.",
  },
  alternates: { canonical: site },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${serif.variable} ${sans.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main data-testid="site-main">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
