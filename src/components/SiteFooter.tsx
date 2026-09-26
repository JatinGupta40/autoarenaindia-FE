import Link from "next/link";

const COLUMNS = [
  {
    title: "Research",
    links: [
      { href: "/cars", label: "All cars" },
      { href: "/news?type=EV", label: "Electric vehicles" },
    ],
  },
  {
    title: "News",
    links: [
      { href: "/news?type=New%20Launch", label: "New launches" },
      { href: "/news?type=Facelift", label: "Facelifts" },
      { href: "/news?type=Review", label: "Reviews" },
    ],
  },
  {
    title: "Read",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/news?type=Comparison", label: "Comparisons" },
      { href: "/news?type=Upcoming", label: "Upcoming cars" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer mt-24 bg-ink-950 text-ink-300">
      <div className="site-footer__inner container-page grid gap-10 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="site-footer__brand max-w-xs">
          <Link href="/" className="site-footer__logo font-display text-2xl font-bold tracking-tight text-white">
            AutoArena<span className="site-footer__logo-dot text-accent-400">.</span>
          </Link>
          <p className="site-footer__tagline mt-3 text-sm leading-relaxed text-ink-400">
            Prices, specifications, launches and reviews for every car on sale in India.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="site-footer__column">
            <p className="site-footer__column-title eyebrow mb-4 text-ink-500">{col.title}</p>
            <ul className="site-footer__list space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.href} className="site-footer__item">
                  <Link href={link.href} className="site-footer__link transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-footer__bottom border-t border-white/5">
        <div className="site-footer__bottom-inner container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-ink-500 sm:flex-row">
          <p className="site-footer__copyright">© {new Date().getFullYear()} AutoArena India. All rights reserved.</p>
          <p className="site-footer__note">Prices are ex-showroom and indicative.</p>
        </div>
      </div>
    </footer>
  );
}
