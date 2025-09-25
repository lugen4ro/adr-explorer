import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // assetPrefix: "./", // ← Use relative paths
  // basePath: "/adr-test", // This is the key setting
  basePath: process.env.GITHUB_REPOSITORY_NAME ? `/${process.env.GITHUB_REPOSITORY_NAME}` : "",
};

export default nextConfig;
