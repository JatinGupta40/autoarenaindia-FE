export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/50 py-16 text-center text-muted">
      {message}
    </div>
  );
}
