// ログインページ
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError("");

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      setLoadingForm(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("メールアドレスまたはパスワードが違います");
      setLoadingForm(false);
    } else {
      router.push("/top");
    }
  };

  // 全ページ共通のフォーカススタイル
  const unifiedFocusWrapper =
    "border border-gray-300 focus-within:border-blue-200 focus-within:ring-1 focus-within:ring-blue-400 rounded-md shadow-sm";

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-20 px-4">
      <Card className="w-full max-w-md rounded-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-600">
            ログイン
          </CardTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            アカウントをお持ちでない方は{" "}
            <Link href="/signup" className="text-emerald-600 hover:underline">
              新規登録
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

            {/* ログインボタン */}
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-4 cursor-pointer"
              disabled={loadingForm}
            >
              {loadingForm ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ログイン中...
                </>
              ) : (
                "ログイン"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
