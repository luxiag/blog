import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";

const ClearHanSerif = localFont({
  src: "../public/fonts/Clear-Han-Serif.woff2",
  variable: "--font-clear-han-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "我的博客",
    template: "%s | 我的博客"
  },
  description: "分享技术见解、学习心得和思考感悟的个人博客",
  keywords: ["博客", "技术", "前端", "编程", "思考"],
  authors: [{ name: "您的名字" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://luxiag.vercel.app/",
    title: "我的博客",
    description: "分享技术见解、学习心得和思考感悟的个人博客",
    siteName: "我的博客",
  },
  twitter: {
    card: "summary_large_image",
    title: "我的博客",
    description: "分享技术见解、学习心得和思考感悟的个人博客",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} ${ClearHanSerif.variable}`}>
      <body className="antialiased bg-[#fafafa] dark:bg-black text-gray-1000 dark:text-gray-1000">
        <Header>
          <main>{children}</main>
        </Header>
      </body>
    </html>
  );
}
