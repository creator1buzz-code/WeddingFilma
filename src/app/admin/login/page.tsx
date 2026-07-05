"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, Input, Button } from "@/components/ui/form";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back.");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
      <div className="w-full max-w-sm">
        <p className="text-[11px] tracking-[0.4em] uppercase text-accent mb-3">Studio console</p>
        <h1 className="font-serif text-4xl mb-10">Sign in.</h1>
        <form onSubmit={onSubmit} className="space-y-6" data-testid="login-form">
          <Field label="Email" htmlFor="l-email">
            <Input id="l-email" name="email" type="email" required data-testid="login-email" />
          </Field>
          <Field label="Password" htmlFor="l-pass">
            <Input id="l-pass" name="password" type="password" required data-testid="login-password" />
          </Field>
          <Button className="w-full justify-center" disabled={loading} data-testid="login-submit">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-8 text-xs text-muted-foreground">Contact your administrator if you cannot access the console.</p>
      </div>
    </div>
  );
}
