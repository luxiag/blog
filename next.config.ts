import type { NextConfig } from "next";

// Force rebuild for CSS cache clearing

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/blog',
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/posts/**',
      },
    ],
  },
  turbopack: {},
};

export default nextConfig;
