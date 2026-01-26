import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CategoryUI } from "@/types/subscription";

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<CategoryUI[]>([]);

  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  interface ApiCategoryResponse {
    id: number;
    user_id: string;
    category_name: string;
  }

  // カテゴリーを取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch");

        const data = (await res.json()) as ApiCategoryResponse[];

        setCategories(
          data.map((c) => ({
            id: String(c.id ?? ""),
            user_id: String(c.user_id ?? ""),
            name: c.category_name ?? "",
            category_name: c.category_name ?? "",
            deleted: false,
          })),
        );
      } catch (error) {
        console.error("カテゴリーの取得に失敗しました:", error);
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
        </div>,
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
        </div>,
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
        const data = (await refreshRes.json()) as ApiCategoryResponse[];

        setCategories(
          data.map((c) => ({
            id: String(c.id),
            user_id: String(c.user_id),
            name: c.category_name,
            category_name: c.category_name,
            deleted: false,
          })),
        );
      }

      toast.success("カテゴリーを更新しました");
    } catch (error) {
      console.error(error);
      toast.error("更新に失敗しました", { duration: 1000 });
    }
  };

  // 表示
  const activeCategories = categories.filter((c) => !c.deleted);
  const leftCategories = activeCategories.slice(0, 5);
  const rightCategories = activeCategories.slice(5);
  const activeCount = activeCategories.length;

  return {
    categories,
    activeCategories,
    leftCategories,
    rightCategories,
    loading,
    isError,
    activeCount,
    handleAddCategory,
    handleChangeCategory,
    handleDeleteCategory,
    handleUpdateCategories,
  };
};
