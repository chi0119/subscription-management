"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import { Subscription } from "@/types/subscription";
import { toast } from "sonner";

export type SubscriptionSummary = Pick<
  Subscription,
  | "id"
  | "subscription_name"
  | "amount"
  | "contract_date"
  | "payment_date"
  | "payment_cycles"
  | "_thisMonthDays"
>;

export const useSubscriptionData = () => {
  const { data: session } = useSession();
  const [averageMonthlyAmount, setAverageMonthlyAmount] = useState(0);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [currentSubscriptions, setCurrentSubscriptions] = useState<
    SubscriptionSummary[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);

  // データ取得＆計算ロジック
  const fetchData = useCallback(async () => {
    if (!session?.user?.id) {
      setAverageMonthlyAmount(0);
      setCurrentMonthTotal(0);
      setCurrentSubscriptions([]);
      setAllSubscriptions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Supabaseからサブスクデータ取得
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          `
          *,
          payment_cycles(payment_cycle_name)
        `
        )
        .eq("user_id", session.user.id);

      if (error) throw error;

      const typedData = data as unknown as Subscription[];

      if (typedData && typedData.length > 0) {
        setAllSubscriptions(typedData);

        const today = new Date();
        // ---------------------------------------------------------
        // 今月支払日計算ロジック
        // ---------------------------------------------------------
        const isDueThisMonth = (sub: any): number[] => {
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
        const currentTotal = typedData.reduce((sum, sub) => {
          const pDays = isDueThisMonth(sub);
          sub._thisMonthDays = pDays;
          return sum + sub.amount * pDays.length;
        }, 0);

        // 月の平均金額
        const totalMonthlyAvg = typedData.reduce((sum, sub) => {
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

        // 今月支払うサブスク一覧
        const filteredSubs = typedData
          .filter(
            (sub) => !!(sub._thisMonthDays && sub._thisMonthDays.length > 0)
          )
          .sort((a, b) => {
            const dayA = a._thisMonthDays?.[0] || 0;
            const dayB = b._thisMonthDays?.[0] || 0;
            return dayA - dayB;
          });

        setCurrentSubscriptions(filteredSubs);
        setCurrentMonthTotal(currentTotal);
        setAverageMonthlyAmount(Math.round(totalMonthlyAvg));
      } else {
        // データなし
        setCurrentMonthTotal(0);
        setAverageMonthlyAmount(0);
        setCurrentSubscriptions([]);
      }
    } catch (err) {
      console.error("データ取得エラー:", err);
      toast.error("データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // リアルタイム更新
  useEffect(() => {
    if (session?.user?.id) {
      fetchData();

      const channel = supabase
        .channel(`realtime:subscriptions:${session.user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "subscriptions",
            filter: `user_id=eq.${session.user.id}`,
          },
          () => fetchData()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.user?.id, fetchData]);

  return {
    averageMonthlyAmount,
    currentMonthTotal,
    currentSubscriptions,
    isLoading,
    refresh: fetchData,
    allSubscriptions,
  };
};
