"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Subscription } from "@/types/subscription";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type SubscriptionContextType = {
  averageMonthlyAmount: number;
  currentMonthTotal: number;
  currentSubscriptions: SubscriptionSummary[];
  isLoading: boolean;
  refreshAverage: () => Promise<void>;
};

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

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const [averageMonthlyAmount, setAverageMonthlyAmount] = useState(0);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [currentSubscriptions, setCurrentSubscriptions] = useState<
    SubscriptionSummary[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAverage = async () => {
    if (!session?.user?.id) {
      setAverageMonthlyAmount(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Supabaseからサブスクデータ取得
      const { data, error } = await supabase
        .from("subscriptions")
        .select<
          string,
          SubscriptionSummary
        >(`id, subscription_name, amount, contract_date,payment_date, payment_cycles(payment_cycle_name)`)
        .eq("user_id", session.user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const today = new Date();

        // 今月支払いが発生するか、または回数を返す関数
        // 30日ごとは「日数ベース」、他は「月ベース」で判定

        const isDueThisMonth = (sub: SubscriptionSummary): number[] => {
          const cycleData = sub.payment_cycles;
          const cycleText =
            (Array.isArray(cycleData)
              ? cycleData[0]?.payment_cycle_name
              : (cycleData as { payment_cycle_name: string })
                  ?.payment_cycle_name
            )?.toString() || "";

          if (!sub.contract_date) return [];

          // 日付を UTC 00:00:00 に固定して計算する
          const contractDate = new Date(sub.contract_date);
          contractDate.setUTCHours(0, 0, 0, 0);

          // 今月の 1日 と 末日 を UTC で作成
          const firstDayOfMonth = new Date(
            Date.UTC(today.getFullYear(), today.getMonth(), 1),
          );
          const lastDayOfMonth = new Date(
            Date.UTC(today.getFullYear(), today.getMonth() + 1, 0),
          );

          const paymentDays: number[] = [];

          const addDays = (date: Date, days: number) => {
            const newDate = new Date(date.getTime());
            newDate.setUTCDate(newDate.getUTCDate() + days);
            return newDate;
          };

          // 30日ごとの場合
          if (cycleText.includes("30日")) {
            let nextPayment = new Date(contractDate.getTime());
            let loopCount = 0;

            // 今月の初日以前であれば、30日ずつ足して今月まで進める
            while (nextPayment < firstDayOfMonth && loopCount < 500) {
              nextPayment = addDays(nextPayment, 30);
              loopCount++;
            }

            // 今月の範囲内にある日付をすべて配列に入れる
            while (nextPayment <= lastDayOfMonth && loopCount < 500) {
              paymentDays.push(nextPayment.getUTCDate());
              nextPayment = addDays(nextPayment, 30);
              loopCount++;
            }

            return paymentDays;
          }

          // 月・年ごとの場合
          const cycleMatch = cycleText.match(/\d+/);
          let interval = cycleMatch ? parseInt(cycleMatch[0], 10) : 1;
          if (cycleText.includes("年")) interval *= 12;

          // 月の差分計算（UTCベース）
          const elapsedMonths =
            (today.getUTCFullYear() - contractDate.getUTCFullYear()) * 12 +
            (today.getUTCMonth() - contractDate.getUTCMonth());

          if (elapsedMonths >= 0 && elapsedMonths % interval === 0) {
            return [contractDate.getUTCDate()];
          }

          return [];
        };

        // 今月の合計金額を計算
        const currentTotal = data.reduce((sum, sub: SubscriptionSummary) => {
          // 今月の支払日を計算
          const pDays = isDueThisMonth(sub);
          sub._thisMonthDays = pDays;

          // 配列の長さ（回数）分だけ金額を合計する（今月支払う回数 × 金額）
          return sum + sub.amount * pDays.length;
        }, 0);

        // 月の平均金額を計算（月割り）
        const totalMonthlyAvg = data.reduce(
          (sum: number, sub: SubscriptionSummary) => {
            const cycleData = sub.payment_cycles;
            const cycleText =
              (Array.isArray(cycleData)
                ? cycleData[0]?.payment_cycle_name
                : (cycleData as { payment_cycle_name: string })
                    ?.payment_cycle_name
              )?.toString() || "";
            const cycleMatch = cycleText.match(/\d+/);
            let interval = cycleMatch ? parseInt(cycleMatch[0], 10) : 1;
            if (cycleText.includes("年")) interval = 12;
            if (cycleText.includes("30日")) interval = 1;

            return sum + sub.amount / interval;
          },
          0,
        );

        // 今月支払うサブスク一覧を抽出
        const filteredSubs = data
          .filter(
            (sub: SubscriptionSummary) =>
              !!(sub._thisMonthDays && sub._thisMonthDays.length > 0),
          ) // 1回以上支払いがあるもの
          .sort((a: SubscriptionSummary, b: SubscriptionSummary) => {
            // 保存しておいた日付配列の「1回目の日付」で並び替える
            const dayA = a._thisMonthDays?.[0] || 0;
            const dayB = b._thisMonthDays?.[0] || 0;
            return dayA - dayB;
          });

        // 状態を更新
        setCurrentSubscriptions(filteredSubs);
        setCurrentMonthTotal(currentTotal);
        setAverageMonthlyAmount(Math.round(totalMonthlyAvg));
      } else {
        // データがない場合
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
  };

  // Supabaseリアルタイムリスナー（データ変化時に再取得）
  useEffect(() => {
    if (session?.user?.id) {
      fetchAverage();
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
          () => fetchAverage(),
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.user?.id]);

  return (
    <SubscriptionContext.Provider
      value={{
        averageMonthlyAmount,
        currentMonthTotal,
        currentSubscriptions,
        isLoading,
        refreshAverage: fetchAverage,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context)
    throw new Error("useSubscription must be used within SubscriptionProvider");
  return context;
};
