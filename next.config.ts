import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    formats: ["image/webp"],
    domains: [
      "static.ticimax.cloud",
      "cdn.pixabay.com",
      "www.zafoni.com",
      "encrypted-tbn0.gstatic.com",
      "i.pinimg.com",
      "res.cloudinary.com",
      "b1528416.smushcdn.com",
      "vercel.com",
      "www.nors.com.tr",
      "images.com",
      "static.vecteezy.com",
      "nors.happencode.com",
    ],
  },

  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots-txt",
      },
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap-xml",
      },
    ];
  },
};

export default nextConfig;