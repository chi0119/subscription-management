import { useMemo } from "react";
import { Subscription } from "@/types/subscription";
import { SubscriptionSummary } from "@/hooks/useSubscriptionData";

/**
 * TOPページ用：サブスクデータ加工専用フック
 * 平均金額・今月合計・今月支払い一覧を計算
 */
export const useTopSubscriptionCustom = (subscriptions: Subscription[]) => {
  const { averageMonthlyAmount, currentMonthTotal, sortedSubscriptions } =
    useMemo(() => {
      if (!subscriptions || subscriptions.length === 0) {
        return {
          averageMonthlyAmount: 0,
          currentMonthTotal: 0,
          sortedSubscriptions: [] as SubscriptionSummary[],
        };
      }

      const today = new Date();

      // ---------------------------------------------------------
      // 今月支払日計算ロジック
      // ---------------------------------------------------------
      const isDueThisMonth = (sub: Subscription): number[] => {
        const cycleData = sub.payment_cycles;
        const cycleText =
          (Array.isArray(cycleData)
            ? cycleData[0]?.payment_cycle_name
            : cycleData?.payment_cycle_name
          )?.toString() || "";

        if (!sub.contract_date) return [];

        const contractDate = new Date(sub.contract_date);
        contractDate.setUTCHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(
          Date.UTC(today.getFullYear(), today.getMonth(), 1)
        );
        const lastDayOfMonth = new Date(
          Date.UTC(today.getFullYear(), today.getMonth() + 1, 0)
        );

        const paymentDays: number[] = [];
        const addDays = (date: Date, days: number) => {
          const newDate = new Date(date.getTime());
          newDate.setUTCDate(newDate.getUTCDate() + days);
          return newDate;
        };

        if (cycleText.includes("30日")) {
          let nextPayment = new Date(contractDate.getTime());
          let loopCount = 0;
          while (nextPayment < firstDayOfMonth && loopCount < 500) {
            nextPayment = addDays(nextPayment, 30);
            loopCount++;
          }
          while (nextPayment <= lastDayOfMonth && loopCount < 500) {
            paymentDays.push(nextPayment.getUTCDate());
            nextPayment = addDays(nextPayment, 30);
            loopCount++;
          }
          return paymentDays;
        }

        const cycleMatch = cycleText.match(/\d+/);
        let interval = cycleMatch ? parseInt(cycleMatch[0], 10) : 1;
        if (cycleText.includes("年")) interval *= 12;

        const elapsedMonths =
          (today.getUTCFullYear() - contractDate.getUTCFullYear()) * 12 +
          (today.getUTCMonth() - contractDate.getUTCMonth());

        if (elapsedMonths >= 0 && elapsedMonths % interval === 0) {
          return [contractDate.getUTCDate()];
        }
        return [];
      };

      // ---------------------------------------------------------
      // 計算実行
      // ---------------------------------------------------------

      // 今月の合計金額
      const currentTotal = subscriptions.reduce((sum, sub) => {
        const pDays = isDueThisMonth(sub);
        sub._thisMonthDays = pDays;
        return sum + sub.amount * pDays.length;
      }, 0);

      // 月の平均金額
      const totalMonthlyAvg = subscriptions.reduce((sum, sub) => {
        const cycleData = sub.payment_cycles as any;
        const cycleText =
          (Array.isArray(cycleData)
            ? cycleData[0]?.payment_cycle_name
            : cycleData?.payment_cycle_name
          )?.toString() || "";

        const cycleMatch = cycleText.match(/\d+/);
        let interval = cycleMatch ? parseInt(cycleMatch[0], 10) : 1;
        if (cycleText.includes("年")) interval = 12;
        if (cycleText.includes("30日")) interval = 1;

        return sum + sub.amount / interval;
      }, 0);

      // 今月支払うサブスク一覧（日付順にソート）
      const filteredSubs = subscriptions
        .filter((sub) => !!(sub._thisMonthDays && sub._thisMonthDays.length > 0))
        .sort((a, b) => {
          const dayA = a._thisMonthDays?.[0] || 0;
          const dayB = b._thisMonthDays?.[0] || 0;
          return dayA - dayB;
        });

      return {
        averageMonthlyAmount: Math.round(totalMonthlyAvg),
        currentMonthTotal: currentTotal,
        sortedSubscriptions: filteredSubs as SubscriptionSummary[],
      };
    }, [subscriptions]);

  return {
    averageMonthlyAmount,
    currentMonthTotal,
    sortedSubscriptions,
  };
};
