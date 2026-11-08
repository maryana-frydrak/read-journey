import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://readjourney.b.goit.study/api/:path*",
      },
    ];
  },
};

export default nextConfig;
