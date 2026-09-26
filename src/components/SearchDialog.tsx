"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Search } from "lucide-react";

const QUICK_LINKS = [
  { href: "/cars", label: "All cars" },
  { href: "/news?type=New%20Launch", label: "New launches" },
  { href: "/news?type=Facelift", label: "Facelifts" },
  { href: "/news?type=Upcoming", label: "Upcoming cars" },
  { href: "/news?type=EV", label: "Electric vehicles" },
  { href: "/blog", label: "Buying guides" },
];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/cars?q=${encodeURIComponent(q)}` : "/cars");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="search-dialog fixed inset-0 z-[60] flex items-start justify-center bg-ink-950/70 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search cars"
            className="search-dialog__panel w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-ink-900 text-white shadow-2xl"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={submit} className="search-dialog__form flex items-center gap-3 border-b border-white/10 px-5">
              <Search size={20} className="search-dialog__search-icon shrink-0 text-ink-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by brand or model, e.g. Creta"
                aria-label="Search by brand or model"
                className="search-dialog__input h-16 flex-1 bg-transparent text-lg placeholder:text-ink-500 focus:outline-none"
              />
              <kbd className="search-dialog__kbd rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-ink-400">Esc</kbd>
            </form>
            <div className="search-dialog__body p-3">
              <p className="search-dialog__eyebrow eyebrow px-3 pt-2 pb-2 text-ink-500">Jump to</p>
              <ul className="search-dialog__list">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href} className="search-dialog__item">
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="search-dialog__link group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ink-200 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                      <ArrowRight size={14} className="search-dialog__link-icon arrow-nudge text-ink-500 group-hover:text-accent-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
