import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a fully static site in ./out for Cloudflare Pages (no Node server).
  output: "export",
  // Static export can't use the on-demand image optimizer.
  images: { unoptimized: true },
};

export default nextConfig;
