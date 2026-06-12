import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Text Compare Pro - Advanced Text Comparison Tool",
  description: "Professional text comparison tool with multiple diff algorithms, syntax highlighting, and advanced features. Compare text, code, JSON, SQL with ease.",
  keywords: "text compare, diff tool, code comparison, json diff, sql compare, text difference, pro text compare",
  authors: [{ name: "Text Compare Pro" }],
  openGraph: {
    title: "Text Compare Pro - Advanced Text Comparison Tool",
    description: "Professional text comparison tool with multiple diff algorithms and advanced features",
    type: "website",
    url: "https://textcompare.pro",
    siteName: "Text Compare Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Text Compare Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Compare Pro - Advanced Text Comparison Tool",
    description: "Professional text comparison tool with multiple diff algorithms and advanced features",
    images: ["/og-image.png"],
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
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://textcompare.pro" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
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
      </body>
    </html>
  );
}
