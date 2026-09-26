const VARIANTS = {
  neutral: "bg-surface-2 text-foreground/80",
  accent: "bg-accent-400/12 text-link ring-1 ring-inset ring-accent-400/25",
  /** For use on top of images and dark bands. */
  glass: "bg-ink-950/55 text-white ring-1 ring-inset ring-white/15 backdrop-blur-md",
  solid: "bg-accent-400 text-ink-950",
} as const;

export function Badge({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
}) {
  return (
    <span
      className={`badge badge--${variant} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
