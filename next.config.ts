import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  output: "export", // 静态导出配置
  images: {
    unoptimized: true, // GitHub Pages不支持图片优化，需要禁用
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/posts/**',
      },
    ],
  },
  // GitHub Pages配置
  basePath: process.env.NEXT_PUBLIC_GITHUB_PAGES ? '' : '',
  assetPrefix: process.env.NEXT_PUBLIC_GITHUB_PAGES ? '/' : '',
  // 禁用服务器端功能
  trailingSlash: true,
};

export default nextConfig;
