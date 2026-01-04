"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    setLoadingForm(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // 全項目入力チェック
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setIsError(true);
      toast.error("すべての項目を入力してください");
      setLoadingForm(false);
      return;
    }

    // メール形式チェック
    if (!emailRegex.test(email)) {
      setIsError(true);
      toast.error("有効なメールアドレスを入力してください");
      setLoadingForm(false);
      return;
    }

    // パスワード強度チェック
    if (!passwordRegex.test(password)) {
      setIsError(true);
      toast.error(
        "英字と数字をそれぞれ1文字以上含む（8文字以上）で入力してください"
      );
      setLoadingForm(false);
      return;
    }

    // パスワード一致チェック
    if (password !== confirmPassword) {
      setIsError(true);
      toast.error("パスワードが一致しません");
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
        toast.success("アカウントを作成しました");
        router.push("/signin");
      } else {
        toast.error(data.error || "新規登録中にエラーが発生しました");
      }
    } catch {
      toast.error("サーバーとの通信中にエラーが発生しました");
    }

    setLoadingForm(false);
  };

  const baseContainer =
    "border rounded-md shadow-sm transition-all duration-200";
  const getContainerClass = (hasError: boolean) => {
    return `${baseContainer} w-full ${
      hasError
        ? "border-red-400 ring-1 ring-red-400 bg-red-50"
        : "border-gray-300 focus-within:border-blue-400 focus-within:ring-0 bg-white"
    }`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50 pt-20 px-4">
      <Card className="w-full max-w-md rounded-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-600">
            新規登録
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* ユーザー名 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                ユーザー名
              </label>
              <div className={getContainerClass(isError && !username.trim())}>
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
              <div
                className={getContainerClass(
                  isError &&
                    (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                )}
              >
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

            {/* パスワード（目隠し） */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                パスワード
              </label>
              <div
                className={`relative ${getContainerClass(
                  isError &&
                    (!password.trim() ||
                      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password))
                )}`}
              >
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="パスワードを入力（英字・数字を含む8文字以上）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 "
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
              <div
                className={`relative ${getContainerClass(
                  isError &&
                    (!confirmPassword.trim() || password !== confirmPassword)
                )}`}
              >
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="パスワードを再入力（英字・数字を含む8文字以上）"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* 登録ボタン */}
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-4 cursor-pointer"
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

            <p className="text-center text-sm text-gray-600 mt-2">
              すでにアカウントをお持ちの方は{" "}
              <Link href="/signin" className="text-emerald-600 hover:underline">
                ログイン
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
