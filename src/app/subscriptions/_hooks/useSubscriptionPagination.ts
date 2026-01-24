import { Subscription } from "@/types/subscription";
import { useState } from "react";

/**
 * 一覧ページ：ページネーション表示
 */

export const useSubscriptionPagination = (items: Subscription[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ページネーション用の計算

  const adjustPageAfterDeletion = () => {
    const newTotalPages = Math.max(
      1,
      Math.ceil((items.length - 1) / itemsPerPage),
    );
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // ページネーション (前後2ページ表示)
  const getPageNumbers = (total: number, current: number) => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }

    return range;
  };
  return {
    currentPage,
    setCurrentPage,
    adjustPageAfterDeletion,
    totalPages,
    currentItems,
    getPageNumbers: getPageNumbers(totalPages, currentPage),
  };
};
