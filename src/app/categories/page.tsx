// カテゴリー管理ページ

"use client";

import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { CategoryUI } from "@/types/subscription";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryUI[]>([]);

  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // カテゴリーを取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as CategoryUI[];

        setCategories(
          data.map((c) => ({
            id: String(c.id ?? ""),
            user_id: String(c.user_id ?? ""),
            name: c.category_name ?? "",
            category_name: c.category_name ?? "",
            deleted: false,
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 追加
  const handleAddCategory = () => {
    const hasEmpty = categories.some((c) => c.name.trim() === "");
    if (hasEmpty) {
      setIsError(true);

      toast.error(
        <div>
          <div className="font-bold">カテゴリーが空欄です</div>
          <div className="text-xs opacity-90">入力してください</div>
        </div>
      );
      return;
    }
    setIsError(false);

    setCategories((prev) => [
      { id: "", category_name: "", user_id: "", name: "", deleted: false },
      ...prev,
    ]);
  };

  // カテゴリーを削除
  const handleDeleteCategory = (index: number) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      if (newCategories[index].id && newCategories[index].id !== "0") {
        newCategories[index].deleted = true;
      } else {
        newCategories.splice(index, 1);
      }

      return newCategories;
    });
  };

  // 入力変更
  const handleChangeCategory = (index: number, value: string) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      newCategories[index] = { ...newCategories[index], name: value };
      return newCategories;
    });
  };

  // 更新
  const handleUpdateCategories = async () => {
    const hasEmpty = categories.some((c) => !c.deleted && c.name.trim() === "");
    if (hasEmpty) {
      setIsError(true);
      toast.error(
        <div>
          <div className="font-bold">カテゴリーが空欄です</div>
          <div className="text-xs opacity-90">入力してください</div>
        </div>
      );
      return;
    }
    setIsError(false);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: categories.map(({ id, name, deleted }) => ({
            id: id === "" ? null : id,
            category_name: name,
            deleted: !!deleted,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const refreshRes = await fetch("/api/categories");
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setCategories(
          data.map((c: any) => ({
            id: String(c.id),
            user_id: String(c.user_id),
            name: c.category_name,
            category_name: c.category_name,
            deleted: false,
          }))
        );
      }

      toast.success("カテゴリーを更新しました");
    } catch (error) {
      console.error(error);
      toast.success("更新に失敗しました", { duration: 1000 });
    }
  };

  // 表示
  const activeCategories = categories.filter((c) => !c.deleted);
  const leftCategories = activeCategories.slice(0, 5);
  const rightCategories = activeCategories.slice(5);

  // 共通フォーカススタイル
  const unifiedFocus =
    "border border-gray-300 focus-within:border-blue-400 rounded-md shadow-sm transition-all";

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
        <PageHeader
          title="カテゴリー管理"
          description="サブスクを分類するカテゴリーを追加・削除して管理できます"
        />

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
              {leftCategories.map((category, index) => {
                if (category.deleted) return null;
                const globalIndex = categories.findIndex(
                  (c) => c.id === category.id
                );
                return (
                  <div
                    key={category.id || index}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`w-full overflow-hidden ${unifiedFocus} ${
                        isError && category.name.trim() === ""
                          ? "border-red-400 focus-within:border-red-500 ring-1 ring-red-400"
                          : ""
                      }`}
                    >
                      <Input
                        value={category.name}
                        onChange={(e) =>
                          handleChangeCategory(globalIndex, e.target.value)
                        }
                        placeholder="入力してください"
                        aria-invalid={isError && category.name.trim() === ""}
                        className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none bg-transparent"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(globalIndex)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* 右列 */}
            <div className="flex flex-col gap-3">
              {rightCategories.map((category) => {
                if (category.deleted) return null;
                const globalIndex = categories.findIndex(
                  (c) => c.id === category.id
                );
                return (
                  <div key={category.id} className="flex items-center gap-3">
                    <div
                      className={`w-full overflow-hidden ${unifiedFocus} ${
                        isError && category.name.trim() === ""
                          ? "border-red-400 focus-within:border-red-500 ring-1 ring-red-400"
                          : ""
                      }`}
                    >
                      <Input
                        value={category.name}
                        onChange={(e) =>
                          handleChangeCategory(globalIndex, e.target.value)
                        }
                        placeholder="入力してください"
                        aria-invalid={isError && category.name.trim() === ""}
                        className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none bg-transparent"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(globalIndex)}
                      className="cursor-pointer"
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
