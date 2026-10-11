import React from "react";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {eyebrow && (
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-signal/10 border border-amber-signal/30 text-amber-signal text-[11px] font-mono font-medium">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl font-serif text-bone font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-bone/70 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
