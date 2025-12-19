"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  // ハンバーガーメニュー
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hiddenPaths = ["/signin", "/signup"];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const handleItemClick = () => {
    setIsMenuOpen(false);
  };

  const navItem = [
    { name: "TOP", href: "/top" },
    { name: "一覧", href: "/subscriptions" },
    { name: "比較", href: "/comparison" },
    { name: "新規登録", href: "/new" },
    { name: "カテゴリー管理", href: "/categories" },
  ];

  const currentPage =
    navItem.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    )?.name || "";

  const handleLogout = async () => {
    setIsMenuOpen(false);

    await signOut({
      callbackUrl: "/signin",
    });

    toast.success("ログアウトしました");
  };

  return (
    <header className="bg-emerald-50/50 shadow-sm sticky top-0 z-50 backdrop-blur-sm ">
      <div className="container px-4 py-1 mx-auto">
        {/* 768px 以上 */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* ロゴ */}
            <Link href={"/"} className="flex items-center space-x-2 ">
              <Image
                src="/logo.svg"
                alt="ロゴ"
                width={50}
                height={50}
                priority
              />
            </Link>

            {/* ナビゲーション */}
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList className="flex space-x-2">
                {navItem.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink
                        href={item.href}
                        className={`
                          py-2 px-4 block whitespace-nowrap text-sm font-medium border-b-2 border-transparent
                          hover:bg-transparent active:bg-transparent focus:bg-transparent
                          ${
                            isActive
                              ? "text-gray-600 border-emerald-500 rounded-none"
                              : "border-transparent text-gray-600"
                          }
                        `}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* ログアウトボタン */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-gray-600 rounded-md shadow-xs cursor-pointer"
          >
            ログアウト
          </Button>
        </div>

        {/* 768px 未満 */}
        <div className="flex items-center justify-between w-full relative md:hidden">
          {/* ロゴ */}
          <Link href={"/"} className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="ロゴ" width={40} height={40} priority />
          </Link>

          {/* 768px 未満 ページ名表示 */}
          <p className="flex-1 text-center text-gray-600 font-semibold">
            {currentPage}
          </p>

          {/* 768px 未満 ハンバーガーメニュー */}
          <div className="relative">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="outline"
              size="icon"
              className="border-gray-300 bg-white text-gray-600 hover:bg-white cursor-pointer"
              aria-label="メニュー"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {/* 768px 未満(768px以上 非表示) */}
            <div
              className={`
                absolute right-0 top-full w-[180px] bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 z-40 rounded-md
                transition-all duration-300 ease-in-out
                ${
                  isMenuOpen
                    ? "max-h-96 opacity-100 py-3"
                    : "max-h-0 opacity-0 overflow-hidden py-0"
                }
              `}
            >
              <nav className="flex flex-col space-y-3 px-2">
                {navItem.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleItemClick}
                      className={`text-xs font-medium text-left ${
                        isActive ? "text-gray-600 font-bold" : "text-gray-600"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                {/* ハンバーガーメニュー ログアウト */}
                <button
                  onClick={() => {
                    handleLogout();
                    handleItemClick();
                  }}
                  className="text-xs font-medium text-left text-gray-600 cursor-pointer"
                >
                  ログアウト
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
