import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface SubscriptionPaginationProps {
  currentPage: number;
  totalPages: number;
  getPageNumbers: (string | number)[];
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

/**
 * 一覧ページ：ページネーション
 */

export const SubscriptionPagination = ({
  currentPage,
  totalPages,
  getPageNumbers,
  setCurrentPage,
}: SubscriptionPaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <div className="hidden lg:flex justify-center mt-8 mb-10">
      <Pagination>
        <PaginationContent className="gap-2">
          <PaginationItem>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="ghost"
              className={`px-3 py-1 text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-emerald-500 cursor-pointer"
              }`}
            >
              &lt;
            </Button>
          </PaginationItem>

          {getPageNumbers.map((num, idx) => (
            <PaginationItem key={idx}>
              {num === "..." ? (
                <span className="px-2 text-gray-400">...</span>
              ) : (
                <Button
                  onClick={() => setCurrentPage(Number(num))}
                  variant="ghost"
                  className={`px-3 py-1 text-sm font-medium transition-colors rounded-none ${
                    currentPage === num
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-600 hover:text-emerald-600 cursor-pointer"
                  }`}
                >
                  {num}
                </Button>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="ghost"
              className={`px-3 py-1 text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-emerald-600 cursor-pointer"
              }`}
            >
              &gt;
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
