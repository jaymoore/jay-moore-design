import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Spline_Sans_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SkipToContent } from "@/components/skip-to-content";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";
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

const SITE_TITLE = "Jay Moore — Product Designer for AI-native workflows";
const SITE_DESCRIPTION =
  "Product designer for AI-native workflows. 10+ years shipping software workflows. Trust-first AI UX. Ships React.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jaymoore.net"),
  title: {
    default: SITE_TITLE,
    template: "%s · Jay Moore",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Jay Moore",
    url: "https://jaymoore.net",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f3f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
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
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
