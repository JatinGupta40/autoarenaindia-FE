import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AutoArena India — New Launches, Facelifts & Car News",
    template: "%s | AutoArena India",
  },
  description:
    "Latest car launches, facelifts, prices and reviews in India — AutoArena India.",
};

const NAV_LINKS = [
  { href: "/cars", label: "Cars" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} min-h-dvh antialiased flex flex-col`}>
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
          <div className="mx-auto max-w-(--container-page) px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-700 tracking-tight text-primary-800 dark:text-accent-100">
              AutoArena<span className="text-accent-400">.</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/80 hover:text-accent-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border mt-16">
          <div className="mx-auto max-w-(--container-page) px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-display font-600 text-primary-800 dark:text-accent-100">
              AutoArena India
            </span>
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} AutoArena India. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
