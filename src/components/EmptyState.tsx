import { CarFront } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center text-muted">
      <CarFront size={28} strokeWidth={1.5} className="empty-state__icon text-ink-400" />
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
