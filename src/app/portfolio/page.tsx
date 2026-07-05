import PortfolioClient from "@/components/portfolio/PortfolioClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Cinematic wedding, pre-wedding, maternity, child and brand films crafted by WeddingFilma.",
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
