export default function NewsLoading() {
  return (
    <div className="mx-auto max-w-(--container-page) px-4 sm:px-6 py-8 animate-pulse">
      <div className="h-9 w-24 rounded bg-neutral-200 dark:bg-primary-600/40 mb-6" />
      <div className="flex flex-wrap gap-2 mb-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-neutral-200 dark:bg-primary-600/40" />
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[3/2] rounded-2xl bg-neutral-200 dark:bg-primary-600/40" />
        ))}
      </div>
    </div>
  );
}
