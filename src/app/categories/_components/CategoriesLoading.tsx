import { Skeleton } from "@/components/ui/skeleton";

/**
 * カテゴリーの管理ページ：ローディング表示
 */

export const CategoriesLoading = () => {
  return (
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
  );
};
