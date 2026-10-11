import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "amber";
  children: React.ReactNode;
}

export function GlassPanel({
  variant = "default",
  className = "",
  children,
  ...props
}: GlassPanelProps) {
  const variantClass =
    variant === "amber"
      ? "bg-[#181C26]/80 border border-[#FFB347]/30 shadow-lg shadow-[#FFB347]/5"
      : variant === "subtle"
      ? "glass-panel-subtle"
      : "glass-panel";

  return (
    <div className={`rounded-2xl p-5 ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
