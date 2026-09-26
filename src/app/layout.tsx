import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="site-layout">
      <body className={`site-layout__body ${inter.variable} ${spaceGrotesk.variable} min-h-dvh antialiased flex flex-col`}>
        <a
          href="#main"
          className="site-layout__skip-link sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-accent-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
        >
          Skip to content
        </a>
        <Providers>
          <SiteHeader />
          <main id="main" className="site-layout__main flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
