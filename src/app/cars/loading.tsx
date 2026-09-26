export default function CarsLoading() {
  return (
    <div className="mx-auto max-w-(--container-page) px-4 sm:px-6 py-8 animate-pulse">
      <div className="h-9 w-32 rounded bg-neutral-200 dark:bg-primary-600/40 mb-6" />
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="h-72 rounded-2xl bg-neutral-200 dark:bg-primary-600/40" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/2] rounded-2xl bg-neutral-200 dark:bg-primary-600/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
