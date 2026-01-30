"use client";

import { useTopSubscriptions } from "./_hooks/useTopSubscriptions";
import { useTopSubscriptionCustom } from "./_hooks/useTopSubscriptionCustom";
import { TopSummaryCard } from "./_components/TopSummaryCard";
import { TopSubscriptionList } from "./_components/TopSubscriptionList";

/**
 * TOPページ：
 * 今月の合計金額・月の平均金額・今月支払いのサブスク一覧
 */
export default function TopPage() {
  // サブスクデータを取得
  const { subscriptions, isLoading, error } = useTopSubscriptions();

  // データを加工（平均金額・今月合計・今月支払い一覧）
  const { averageMonthlyAmount, currentMonthTotal, sortedSubscriptions } =
    useTopSubscriptionCustom(subscriptions);

  if (error) {
    return (
      <div className="container mx-auto px-4 mt-5">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 mt-5 mb-30">
        <div className="mx-auto w-full sm:w-2/3">
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
    </>
  );
}
