// ログインページ
"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "login-required") {
      setTimeout(() => {
        toast.error("ログインしてください", { duration: 1000 });
      }, 100);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);

    if (!email || !password) {
      toast.error("メールアドレスとパスワードを入力してください");
      setLoadingForm(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error("メールアドレスまたはパスワードが違います");
      setLoadingForm(false);
    } else {
      router.push("/top");
    }
  };

  // 全ページ共通のフォーカススタイル
  const unifiedFocusWrapper =
    "border border-gray-300 focus-within:border-blue-200 focus-within:ring-1 focus-within:ring-blue-400 rounded-md shadow-sm";

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50 pt-20 px-4">
      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          box-shadow: 0 0 0 30px white inset !important;
        }
      `}</style>

      <Card className="w-full max-w-md rounded-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-600">
            ログイン
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-10 bg-transparent"
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

              <div className={`w-full relative ${unifiedFocusWrapper}`}>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-10 bg-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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

            <p className="text-center text-sm text-gray-600 mt-6">
              アカウントをお持ちでない方は{" "}
              <Link href="/signup" className="text-emerald-600 hover:underline">
                新規登録
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
