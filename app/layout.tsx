import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import BambooRuler from "@/components/BambooRuler";
import RulerLayout from "@/components/RulerLayout";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

const inter = localFont({
  src: [
    { path: "./fonts/inter-latin-400-normal.woff2", style: "normal", weight: "400" },
    { path: "./fonts/inter-latin-700-normal.woff2", style: "normal", weight: "700" },
  ],
  variable: "--font-inter",
  display: 'swap',
});

const ibmPlexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-300-normal.woff2", style: "normal", weight: "300" },
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", style: "normal", weight: "400" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", style: "normal", weight: "500" },
    { path: "./fonts/ibm-plex-mono-latin-600-normal.woff2", style: "normal", weight: "600" },
    { path: "./fonts/ibm-plex-mono-latin-700-normal.woff2", style: "normal", weight: "700" },
  ],
  variable: "--font-ibm-plex-mono",
  display: 'swap',
});

const notoSerifSC = localFont({
  src: "./fonts/ZCOOLKuaiLe-Regular.ttf",
  variable: "--font-noto-serif-sc",
  display: 'swap',
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
    <html lang="zh-CN" suppressHydrationWarning className={`${inter.variable} ${ibmPlexMono.variable} ${notoSerifSC.variable}`}>
      <body className="antialiased overflow-x-hidden" style={{ backgroundColor: 'var(--background)' }}>
        <RulerLayout>
          <Header />
          <main className="overflow-x-hidden">{children}</main>
        </RulerLayout>
      </body>
    </html>
  );
}
