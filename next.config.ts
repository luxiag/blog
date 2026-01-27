import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
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
  }
};

export default nextConfig;
