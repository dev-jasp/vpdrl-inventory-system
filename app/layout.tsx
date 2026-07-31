import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
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
      className={`${manrope.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
