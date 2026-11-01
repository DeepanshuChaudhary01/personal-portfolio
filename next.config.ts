import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray package-lock.json in the home folder otherwise confuses root detection.
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
