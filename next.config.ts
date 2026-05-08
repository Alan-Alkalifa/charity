import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/campaigns/:slug",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
