import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Canonical routes are /private and /business; the earlier names redirect.
  async redirects() {
    return [
      { source: "/individual", destination: "/private", permanent: true },
      { source: "/company", destination: "/business", permanent: true },
    ];
  },
};

export default nextConfig;
