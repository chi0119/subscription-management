import { CategoryItem } from "./CategoryItem";

interface CategoryListProps {
  categories: any[];
  allCategories: any[];
  isError: boolean;
  activeCount: number;
  unifiedFocus: string;
  onChange: (globalIndex: number, value: string) => void;
  onDelete: (globalIndex: number) => void;
}

/**
 * カテゴリーの管理ページ：カテゴリーリスト
 */

export const CategoryList = ({
  categories,
  allCategories,
  isError,
  activeCount,
  unifiedFocus,
  onChange,
  onDelete,
}: CategoryListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {categories.map((category, index) => {
        if (category.deleted) return null;
        const globalIndex = allCategories.findIndex(
          (c) => c.id === category.id,
        );
        return (
          <CategoryItem
            key={category.id || index}
            name={category.name}
            isError={isError}
            activeCount={activeCount}
            unifiedFocus={unifiedFocus}
            onChange={(value) => onChange(globalIndex, value)}
            onDelete={() => onDelete(globalIndex)}
          />
        );
      })}
    </div>
  );
};
