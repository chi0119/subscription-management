// カテゴリー管理ページ

"use client";

import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<string[]>([""]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // カテゴリーを取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/auth/categories");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCategories(data.map((c: any) => c.category_name));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // カテゴリーを追加
  const handleAddCategory = () => {
    const hasEmpty = categories.some((c) => c.trim() === "");
    if (hasEmpty) {
      setShowPopup(true);
      return;
    }
    setCategories((prev) => ["", ...prev]);
  };

  // 3秒後にポップアップ削除
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // カテゴリーを削除
  const handleDeleteCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  // 入力変更
  const handleChangeCategory = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  // 更新
  const handleUpdateCategories = async () => {
    try {
      const res = await fetch("/api/auth/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("カテゴリーを更新しました", { duration: 1000 });
    } catch (error) {
      console.error(error);
      toast.success("更新に失敗しました", { duration: 1000 });
    }
  };
  // 表示
  const leftCategories = categories.slice(0, 5);
  const rightCategories = categories.slice(5);

  // 共通フォーカススタイル
  const unifiedFocus =
    "border border-gray-300 focus-within:border-blue-200 focus-within:ring-1 focus-within:ring-blue-400 rounded-md shadow-sm";

  // ローディング中の表示
  if (loading) {
    return (
      <div
        className={`transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="sm:w-2/3 w-full mx-auto py-10 px-4 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/3 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sm:w-2/3 w-full mx-auto py-5 md:py-10 px-4">
        <h1 className="text-2xl font-extrabold text-gray-600 mb-10 text-center hidden md:block">
          カテゴリー管理
        </h1>
        <p className="text-sm text-gray-600 mb-15 text-center">
          サブスクを分類するカテゴリーを追加・削除して管理できます
        </p>

        {/* ポップアップ */}
        {showPopup && (
          <div className="absolute inset-x-0 top-36 flex justify-center z-50">
            <Alert variant="destructive" className="w-fit shadow-lg">
              <AlertDescription>
                カテゴリーが空欄です。入力してください。
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* カテゴリー 入力欄 削除ボタン */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-full sm:w-2/3 flex justify-start">
            <Button
              type="button"
              onClick={handleAddCategory}
              className="mb-1 cursor-pointer shadow-xs h-7 px-3 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 text-xs flex items-center gap-1"
            >
              <Plus size={12} className="text-emerald-600" />
              カテゴリーを追加
            </Button>
          </div>

          {/* 2列 レイアウト */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full sm:w-2/3">
            {/* 左列 */}
            <div className="flex flex-col gap-3">
              {leftCategories.map((category, index) => (
                <div key={index} className="flex items-center gap-3">
                  {/* 共通フォーカススタイル */}
                  <div className={`w-full sm:max-w-sm h-10 ${unifiedFocus}`}>
                    <Input
                      type="text"
                      value={category}
                      onChange={(e) =>
                        handleChangeCategory(index, e.target.value)
                      }
                      className="w-full h-full px-3 py-2 border-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
                      placeholder="入力してください"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(index)}
                    className="rounded-md text-red-500 cursor-pointer hover:text-red-500 hover:bg-red-50"
                    aria-label="削除"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              ))}
            </div>

            {/* 右列 */}
            <div className="flex flex-col gap-3">
              {rightCategories.map((category, i) => {
                const index = i + 5;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-full sm:max-w-sm h-10 ${unifiedFocus}`}>
                      <Input
                        type="text"
                        value={category}
                        onChange={(e) =>
                          handleChangeCategory(index, e.target.value)
                        }
                        className="w-full h-full px-3 py-2 border-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
                        placeholder="入力してください"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(index)}
                      className="rounded-md text-red-500 cursor-pointer hover:bg-gray-50"
                      aria-label="削除"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 注意書き */}
          <div className="text-red-500 mt-10 w-full sm:w-2/3 mx-auto text-sm">
            <p>
              ※カテゴリーを「追加」または、「削除」した場合は、「更新」ボタンを押下してください。
              <br />
              &nbsp;「更新」ボタンを押下せず、ページを移動した場合、変更内容が更新されません。
            </p>
          </div>

          {/* 更新ボタン */}
          <div className="flex justify-center mt-5">
            <Button
              className="cursor-pointer shadow-sm py-2 px-8 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleUpdateCategories}
            >
              更新
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
