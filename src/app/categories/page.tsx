"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { useCategoryManagement } from "./_hooks/useCategoryManagement";
import { CategoriesNotice } from "./_components/CategoryNotice";
import { CategoriesLoading } from "./_components/CategoriesLoading";
import { CategoryList } from "./_components/CategoryList";

const CategoriesPage = () => {
  const {
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
  } = useCategoryManagement();

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
        <CategoriesLoading />
      </div>
    );
  }

  return (
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
          <CategoryList
            categories={leftCategories}
            allCategories={categories}
            isError={isError}
            activeCount={activeCount}
            unifiedFocus={unifiedFocus}
            onChange={handleChangeCategory}
            onDelete={handleDeleteCategory}
          />

          {/* 右列 */}
          <CategoryList
            categories={rightCategories}
            allCategories={categories}
            isError={isError}
            activeCount={activeCount}
            unifiedFocus={unifiedFocus}
            onChange={handleChangeCategory}
            onDelete={handleDeleteCategory}
          />
        </div>
      </div>

      {/* 注意書き */}
      <CategoriesNotice />

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
  );
};

export default CategoriesPage;
