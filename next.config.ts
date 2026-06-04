import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root so Turbopack never tries to infer it from a
    // lockfile higher up the tree; keeps dev/build deterministic across
    // machines.
    root: __dirname,
  },
};

export default nextConfig;
