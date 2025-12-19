// 新規登録ページ

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("すべての項目を入力してください");
      setLoadingForm(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setLoadingForm(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/signin");
      } else {
        setError(data.error || "新規登録中にエラーが発生しました");
      }
    } catch {
      setError("サーバーとの通信中にエラーが発生しました");
    }

    setLoadingForm(false);
  };

  // 共通のフォーカススタイル
  const unifiedFocusWrapper =
    "border border-gray-300 focus-within:border-blue-200 focus-within:ring-1 focus-within:ring-blue-400 rounded-md shadow-sm";

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50 pt-20 px-4">
      <Card className="w-full max-w-md rounded-md shadow-xs">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            新規登録
          </CardTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/signin" className="text-blue-500 hover:underline">
              ログイン
            </Link>
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-2 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ユーザー名 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                ユーザー名
              </label>
              <div className={`w-full ${unifiedFocusWrapper}`}>
                <Input
                  id="username"
                  type="text"
                  placeholder="ユーザー名を入力"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-10"
                />
              </div>
            </div>

            {/* メールアドレス */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                メールアドレス
              </label>
              <div className={`w-full ${unifiedFocusWrapper}`}>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-10"
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                パスワード
              </label>
              <div className={`w-full ${unifiedFocusWrapper}`}>
                <Input
                  id="password"
                  type="password"
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-10"
                />
              </div>
            </div>

            {/* パスワード確認 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                パスワード確認
              </label>
              <div className={`w-full ${unifiedFocusWrapper}`}>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="パスワードを再入力"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-10"
                />
              </div>
            </div>

            {/* 登録ボタン */}
            <Button
              type="submit"
              className="w-full bg-blue-400 hover:bg-blue-500 text-white mt-4"
              disabled={loadingForm}
            >
              {loadingForm ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                "新規登録"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
