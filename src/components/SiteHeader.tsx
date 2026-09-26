"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { SearchDialog } from "@/components/SearchDialog";

const NAV_LINKS = [
  { href: "/cars", label: "Cars" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
];

/**
 * Fixed header that floats transparently over the dark band at the top of every page,
 * then turns into a frosted charcoal bar once the page scrolls.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  // "/" or Cmd/Ctrl+K opens search from anywhere except while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`site-header fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-premium ${
          solid
            ? "site-header--solid border-b border-white/10 bg-ink-950/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="site-header__inner container-page flex h-(--header-h) items-center justify-between gap-4">
          <Link
            href="/"
            className="site-header__logo font-display text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
          >
            AutoArenaIndia
            {/* <span className="site-header__logo-dot text-accent-400">.</span> */}
          </Link>

          <nav aria-label="Main" className="site-header__nav hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`site-header__nav-link relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                    active ? "site-header__nav-link--active text-ink-950" : "text-ink-200 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="site-header__nav-pill absolute inset-0 rounded-full bg-white"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="site-header__nav-label relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="site-header__actions flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="site-header__search-button group flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm text-ink-300 transition-all duration-300 hover:border-white/25 hover:text-white sm:pr-2 sm:pl-4"
              aria-label="Search cars"
            >
              <Search size={16} className="site-header__search-icon" />
              <span className="site-header__search-label hidden sm:inline">Search cars</span>
              <kbd className="site-header__search-kbd ml-2 hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[10px] text-ink-400 lg:inline">
                /
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="site-header__menu-button grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X size={18} className="site-header__close-icon" /> : <Menu size={18} className="site-header__menu-icon" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="site-header__mobile-nav overflow-hidden border-t border-white/10 md:hidden"
            >
              <ul className="site-header__mobile-list container-page space-y-1 py-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    className="site-header__mobile-item"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`site-header__mobile-link flex items-center justify-between rounded-xl px-4 py-3 font-display text-lg font-semibold transition-colors ${
                        isActive(link.href) ? "site-header__mobile-link--active bg-white/10 text-white" : "text-ink-200 hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                      {isActive(link.href) && <span className="site-header__mobile-indicator h-1.5 w-1.5 rounded-full bg-accent-400" />}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
