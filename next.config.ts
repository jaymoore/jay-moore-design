import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.jaymoore.net" }],
        destination: "https://jaymoore.net/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
