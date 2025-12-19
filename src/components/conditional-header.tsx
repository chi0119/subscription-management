"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // ログインページではヘッダーを表示しない
  if (pathname === "/") return null;

  return <Header />;
}
