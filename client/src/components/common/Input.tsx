import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export const Input = ({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-textPrimary outline-none transition placeholder:text-textSecondary focus:border-accent ${className}`}
    {...props}
  />
);

export const Textarea = ({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-textPrimary outline-none transition placeholder:text-textSecondary focus:border-accent ${className}`}
    {...props}
  />
);
