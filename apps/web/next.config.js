/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-global.website-files.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "swiftwithmajid.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ad.linksynergy.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img-b.udemycdn.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "esbenp.gallerycdn.vsassets.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "dbaeumer.gallerycdn.vsassets.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "uxwing.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "png.pngtree.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
        port: "",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
