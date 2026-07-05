import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function BookingSuccessPage({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams.code ?? "WF-XXXXXX";
  return (
    <div className="min-h-screen grid place-items-center pt-32 pb-24">
      <div className="container max-w-2xl text-center">
        <CheckCircle2 className="h-14 w-14 text-accent mx-auto mb-8" strokeWidth={1} />
        <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Booking received</p>
        <h1 className="font-serif text-5xl md:text-6xl leading-[0.95] text-balance">
          Thank you. We'll be in touch.
        </h1>
        <p className="mt-6 text-muted-foreground max-w-md mx-auto">
          Our creative director will personally reach out within 24 hours. Please save
          your booking reference for our conversation.
        </p>
        <p className="mt-10 text-xs tracking-[0.3em] uppercase text-muted-foreground">Booking ID</p>
        <p data-testid="booking-code" className="font-serif text-3xl text-accent mt-2">{code}</p>
        <div className="mt-14 flex justify-center gap-4">
          <Link href="/" className="rounded-full border border-border px-6 py-3 text-xs tracking-[0.24em] uppercase hover:border-accent">Home</Link>
          <Link href="/portfolio" className="rounded-full bg-accent text-accent-foreground px-6 py-3 text-xs tracking-[0.24em] uppercase hover:bg-accent/90">See portfolio</Link>
        </div>
      </div>
    </div>
  );
}
