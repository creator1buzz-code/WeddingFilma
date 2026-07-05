import BookingForm from "@/components/booking/BookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book your shoot",
  description: "Share your date — we respond within 24 hours. Twelve weddings a year, thoughtfully chosen.",
};

export default function BookingPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="container max-w-4xl">
        <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Reserve a date</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] text-balance">
          Let's write your <em className="italic text-accent">film.</em>
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          A short form, then a personal reply from our creative director within 24 hours.
        </p>

        <div className="mt-16">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
