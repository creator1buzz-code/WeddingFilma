"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Field, Input, Textarea, Button } from "@/components/ui/form";
import { ArrowRight } from "lucide-react";

const EVENT_TYPES = [
  { v: "WEDDING", l: "Wedding" },
  { v: "PRE_WEDDING", l: "Pre-Wedding" },
  { v: "ENGAGEMENT", l: "Engagement" },
  { v: "MATERNITY", l: "Maternity" },
  { v: "CHILD", l: "Child" },
  { v: "CORPORATE", l: "Corporate / Brand" },
  { v: "PRODUCT", l: "Product Video" },
  { v: "EVENT", l: "Event Coverage" },
];

const SERVICES = [
  "Wedding Photography",
  "Wedding Films",
  "Drone Aerial",
  "Same-Day Edit",
  "Live Streaming",
  "Traditional Album",
  "Save-the-Date",
];

export default function BookingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<string[]>([]);

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const payload = {
      fullName: data.get("fullName"),
      email: data.get("email"),
      phone: data.get("phone"),
      eventType: data.get("eventType"),
      eventDate: data.get("eventDate"),
      venue: data.get("venue"),
      city: data.get("city"),
      budget: data.get("budget"),
      guestCount: Number(data.get("guestCount")) || null,
      services,
      notes: data.get("notes"),
    };
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      toast.success("Booking received — check your inbox.");
      router.push(`/booking/success?code=${json.bookingCode}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-10"
      data-testid="booking-form"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Full name" htmlFor="fullName">
          <Input id="fullName" name="fullName" required data-testid="input-fullname" />
        </Field>
        <Field label="Mobile number" htmlFor="phone">
          <Input id="phone" name="phone" type="tel" required data-testid="input-phone" />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required data-testid="input-email" />
        </Field>
        <Field label="Event type" htmlFor="eventType">
          <select
            id="eventType"
            name="eventType"
            required
            defaultValue="WEDDING"
            data-testid="input-eventtype"
            className="w-full bg-transparent border-b border-border py-3 text-base focus:outline-none focus:border-accent"
          >
            {EVENT_TYPES.map((e) => (
              <option key={e.v} value={e.v} className="bg-background">{e.l}</option>
            ))}
          </select>
        </Field>
        <Field label="Event date" htmlFor="eventDate">
          <Input id="eventDate" name="eventDate" type="date" required data-testid="input-date" />
        </Field>
        <Field label="City" htmlFor="city">
          <Input id="city" name="city" required data-testid="input-city" />
        </Field>
        <Field label="Venue (optional)" htmlFor="venue">
          <Input id="venue" name="venue" data-testid="input-venue" />
        </Field>
        <Field label="Guest count (approx.)" htmlFor="guestCount">
          <Input id="guestCount" name="guestCount" type="number" min={0} data-testid="input-guests" />
        </Field>
        <Field label="Budget" htmlFor="budget" className="md:col-span-2">
          <select
            id="budget"
            name="budget"
            defaultValue=""
            data-testid="input-budget"
            className="w-full bg-transparent border-b border-border py-3 text-base focus:outline-none focus:border-accent"
          >
            <option value="" className="bg-background">Select a range</option>
            <option value="1-3L" className="bg-background">₹ 1 – 3 Lakhs</option>
            <option value="3-6L" className="bg-background">₹ 3 – 6 Lakhs</option>
            <option value="6-10L" className="bg-background">₹ 6 – 10 Lakhs</option>
            <option value="10L+" className="bg-background">₹ 10 Lakhs +</option>
          </select>
        </Field>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-4">Preferred services</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleService(s)}
              data-testid={`service-toggle-${s.replace(/\s+/g, "-").toLowerCase()}`}
              className={`rounded-full border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                services.includes(s)
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Field label="Anything we should know?" htmlFor="notes">
        <Textarea id="notes" name="notes" placeholder="Family traditions, must-have shots, wardrobe ideas…" data-testid="input-notes" />
      </Field>

      <div className="pt-4">
        <Button type="submit" disabled={loading} data-testid="submit-booking">
          {loading ? "Sending…" : "Send booking request"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">By submitting, you agree to our terms & privacy policy.</p>
      </div>
    </motion.form>
  );
}
