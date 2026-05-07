import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-white hover:bg-violet-500",
  secondary: "bg-card text-textPrimary border border-border hover:bg-neutral-900",
  ghost: "bg-transparent text-textSecondary hover:bg-card hover:text-textPrimary",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/20"
};

export const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) => (
  <button
    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
