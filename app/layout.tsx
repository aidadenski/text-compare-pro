import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 min-h-screen`}>
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-blue-900/50 -z-10" />
        {children}
      </body>
    </html>
  );
}