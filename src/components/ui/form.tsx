import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full bg-transparent border-b border-border py-3 text-base placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full bg-transparent border border-border rounded-sm p-4 text-base placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors min-h-[120px] resize-y",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Label = ({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
  <label htmlFor={htmlFor} className={cn("text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-1 block", className)}>
    {children}
  </label>
);

export const Field = ({ label, htmlFor, children, className }: { label: string; htmlFor?: string; children: React.ReactNode; className?: string }) => (
  <div className={cn("space-y-1", className)}>
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
  </div>
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs tracking-[0.24em] uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary" && "bg-accent text-accent-foreground hover:bg-accent/90",
        variant === "ghost" && "border border-border hover:border-accent hover:text-accent",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
