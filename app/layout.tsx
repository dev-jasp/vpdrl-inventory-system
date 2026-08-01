import type { Metadata } from "next";
import { Chivo_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Uncut Sans — a Helvetica-adjacent grotesk with tight apertures, so the UI
 * reads as engineered rather than friendly.
 *
 * Self-hosted rather than pulled from `next/font/google`, because it is not a
 * Google font: the faces in `app/fonts/` come from `@fontsource/uncut-sans`
 * (OFL-1.1, Kasper Nordkvist — see `UncutSans-LICENSE.txt`), which repackages
 * https://github.com/kaspernordkvist/uncut_sans.
 *
 * There is no variable cut, so each weight is its own file and only the four
 * the UI actually asks for are shipped. The family stops at 700, which is why
 * headings are `font-semibold` and not the design's `font-extrabold` — 800 would
 * silently match down to this same 700 face. Only the mono figures carry
 * `font-extrabold`, where Chivo's variable axis actually reaches it.
 */
const uncutSans = localFont({
  variable: "--font-uncut-sans",
  display: "swap",
  src: [
    { path: "./fonts/UncutSans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/UncutSans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/UncutSans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/UncutSans-700.woff2", weight: "700", style: "normal" },
  ],
});

/**
 * Chivo Mono, for the figures the lab reads off a label: lot numbers, expiry
 * dates, quantities, and peso amounts. See `docs/adr/0001-typography.md` for
 * why this one and not Geist Mono.
 *
 * The short version: it is the mono companion to Chivo, a grotesk, so it
 * shares Uncut Sans' design logic — and its x-height is 0.511em against
 * Uncut's 0.500em, which is what keeps a mono cell sitting level with the sans
 * around it.
 *
 * `latin-ext` is listed because it carries U+20B1 (₱) — the `latin` subset
 * does not, and Uncut Sans has no peso sign at any weight. `subsets` controls
 * which faces get a preload tag, not which are declared, so this is the
 * difference between the peso sign painting with the amount and swapping in
 * a beat later. Peso figures sit above the fold on the dashboard.
 */
const chivoMono = Chivo_Mono({
  variable: "--font-chivo-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "VPDRL Inventory and Supplies",
  description: "Lab inventory, staff and supplier tracking for VPDRL.",
};

// Applies the stored theme before first paint so a dark-theme reload doesn't
// flash light. Kept in sync with `ThemeToggle`, which writes the same key.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `themeScript` sets data-theme before React hydrates.
      suppressHydrationWarning
      // Font smoothing and the page background live in globals.css, with the
      // rest of the design's body styles.
      className={`${uncutSans.variable} ${chivoMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
