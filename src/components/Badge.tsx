const VARIANTS = {
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-primary-600/40 dark:text-primary-100",
  accent: "bg-accent-100 text-accent-500 dark:bg-accent-400/20 dark:text-accent-200",
  primary: "bg-primary-100 text-primary-600 dark:bg-primary-600/40 dark:text-primary-100",
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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
