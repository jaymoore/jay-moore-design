import type { Metadata } from "next";
import { Hanken_Grotesk, Spline_Sans_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SkipToContent } from "@/components/skip-to-content";
import { TopBar } from "@/components/top-bar";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const splineSansMono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jaymoore.net"),
  title: {
    default: "Jay Moore — Design Engineer for AI-native workflows",
    template: "%s · Jay Moore",
  },
  description:
    "Design engineer for AI-native workflows. 10+ years shipping software workflows. Trust-first AI UX. Ships React.",
};

// Runs synchronously before React hydration to prevent FOUC on dark mode.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t!=='light'&&d)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${hankenGrotesk.variable} ${splineSansMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <SkipToContent />
        <ThemeProvider>
          <TopBar />
          <main id="main" className="flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
