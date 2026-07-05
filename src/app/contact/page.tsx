"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Field, Input, Textarea, Button } from "@/components/ui/form";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Could not send");
      toast.success("We'll reply within 24 hours.");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container grid md:grid-cols-12 gap-14">
        <div className="md:col-span-5">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-4">Say hello</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[0.95] text-balance">
            Come, tell us your <em className="italic text-accent">story.</em>
          </h1>
          <p className="mt-8 text-muted-foreground max-w-md">
            For weddings, please use the <a href="/booking" className="underline decoration-1 underline-offset-4 hover:text-accent">booking form</a>.
            For press, collaborations or general enquiries, drop us a note.
          </p>

          <ul className="mt-12 space-y-6 text-sm">
            <li className="flex items-center gap-4"><Mail className="h-5 w-5 text-accent" /> bookings@weddingfilma.in</li>
            <li className="flex items-center gap-4"><Phone className="h-5 w-5 text-accent" /> +91 98XXX XXXXX</li>
            <li className="flex items-center gap-4"><MapPin className="h-5 w-5 text-accent" /> Bandra West, Mumbai · Studio by appointment</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-7 space-y-8" data-testid="contact-form">
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Your name" htmlFor="c-name">
              <Input id="c-name" name="name" required data-testid="contact-name" />
            </Field>
            <Field label="Email" htmlFor="c-email">
              <Input id="c-email" name="email" type="email" required data-testid="contact-email" />
            </Field>
            <Field label="Phone (optional)" htmlFor="c-phone">
              <Input id="c-phone" name="phone" data-testid="contact-phone" />
            </Field>
            <Field label="Subject" htmlFor="c-subject">
              <Input id="c-subject" name="subject" data-testid="contact-subject" />
            </Field>
          </div>
          <Field label="Message" htmlFor="c-msg">
            <Textarea id="c-msg" name="message" required data-testid="contact-message" />
          </Field>
          <Button disabled={loading} data-testid="contact-submit">
            {loading ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
