import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink/90 disabled:bg-ink/40",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink/5 disabled:border-ink/30 disabled:text-ink/30",
  ghost: "bg-transparent text-slate hover:text-ink disabled:text-slate/40",
};

/** Shared button styling across the app — three variants, one focus ring. */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
