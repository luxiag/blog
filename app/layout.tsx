import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BambooRuler from "@/components/BambooRuler";
import RulerLayout from "@/components/RulerLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: 'swap',
});

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
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
      <body className="antialiased" style={{ backgroundColor: 'var(--background)' }}>
        <RulerLayout>
          <Header />
          <main>{children}</main>
        </RulerLayout>
      </body>
    </html>
  );
}
