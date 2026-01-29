import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import ConditionalHeader from "@/components/conditional-header";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "サブスク管理アプリ",
  description: "サブスク管理",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <NextAuthProvider>
          {/* 全ページ共通ヘッダー */}
          <ConditionalHeader />

          {/* メインコンテンツ */}
          <main className="container mx-auto px-4 py-8 min-h-screen">
            {children}
          </main>

          {/* トースト通知 */}
          <Toaster position="top-center" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
