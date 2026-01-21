"use client";

import { useTopPage } from "./_hooks/useTopPage";
import { TopSummaryCard } from "./_components/TopSummaryCard";
import { TopSubscriptionList } from "./_components/TopSubscriptionList";

/**
 * TOPページ：
 * 今月の合計金額・月の平均金額・今月支払いのサブスク一覧
 */
export default function TopPage() {
  const {
    averageMonthlyAmount,
    currentMonthTotal,
    sortedSubscriptions,
    isLoading,
  } = useTopPage();

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mt-5 mb-30">
          <div className="flex flex-col items-center">
            <div className="sm:w-2/3 w-full">
              {/* 今月の合計金額・月の平均金額*/}
              <TopSummaryCard
                total={currentMonthTotal}
                average={averageMonthlyAmount}
                isLoading={isLoading}
              />

              {/* 今月支払いのサブスク一覧 */}
              <TopSubscriptionList
                subscriptions={sortedSubscriptions}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
