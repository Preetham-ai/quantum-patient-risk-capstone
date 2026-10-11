import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-xs space-x-1.5"
      : size === "lg"
      ? "px-6 py-3.5 text-sm space-x-2.5 font-semibold"
      : "px-4 py-2.5 text-xs space-x-2";

  const variantClasses =
    variant === "primary"
      ? "bg-amber-signal text-ink font-bold hover:bg-[#ffbe66] shadow-md shadow-amber-signal/20 active:scale-[0.98]"
      : variant === "outline"
      ? "bg-surface-1 border border-hairline hover:border-hairline-strong text-bone hover:bg-surface-2"
      : variant === "danger"
      ? "bg-risk-high text-bone font-bold hover:bg-[#f05a5f] shadow-md shadow-risk-high/20"
      : "bg-transparent text-bone/70 hover:text-bone hover:bg-surface-2";

  return (
    <button className={`${base} ${sizeClasses} ${variantClasses} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
