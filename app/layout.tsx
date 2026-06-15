import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://textcompare.pro'),
  title: {
    default: "Text Compare Pro - Advanced Text Comparison Tool",
    template: "%s · Text Compare Pro",
  },
  description: "Professional text comparison tool with multiple diff algorithms, syntax highlighting, and advanced features. Compare text, code, JSON, SQL with ease.",
  keywords: "text compare, diff tool, code comparison, json diff, sql compare, text difference, pro text compare",
  authors: [{ name: "Text Compare Pro" }],
  applicationName: "Text Compare Pro",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Text Compare Pro - Advanced Text Comparison Tool",
    description: "Professional text comparison tool with multiple diff algorithms and advanced features",
    type: "website",
    url: "https://textcompare.pro",
    siteName: "Text Compare Pro",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Compare Pro - Advanced Text Comparison Tool",
    description: "Professional text comparison tool with multiple diff algorithms and advanced features",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to your real token to emit the
  // verification meta tag; otherwise no (invalid) tag is rendered.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#141311" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {/* Ambient backdrop: paper texture, manuscript rules and the two
            quotation marks standing in for the two texts being compared. */}
        <div aria-hidden className="bg-art">
          <div className="bg-rules" />
          <span className="bg-glyph bg-glyph-left font-serif italic">&ldquo;</span>
          <span className="bg-glyph bg-glyph-right font-serif italic">&rdquo;</span>
          <div className="bg-noise" />
        </div>
        {children}
        <StructuredData />
      </body>
    </html>
  );
}
