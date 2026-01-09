import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    url: "https://yourblog.com",
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
    <html lang="zh-CN" className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
