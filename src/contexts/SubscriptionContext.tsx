"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SubscriptionContextType = {
  averageMonthlyAmount: number;
  isLoading: boolean;
  refreshAverage: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const [averageMonthlyAmount, setAverageMonthlyAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 月の平均金額を計算
  const fetchAverage = async () => {
    if (!session?.user?.id) {
      setAverageMonthlyAmount(0);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          `
          amount,
          payment_cycles(payment_cycle_name)
        `
        )
        .eq("user_id", session.user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const totalMonthly = data.reduce((sum: number, sub: any) => {
          const cycleText =
            sub.payment_cycles?.payment_cycle_name?.toString() || "";
          const cycleMatch = cycleText.match(/\d+/);
          const cycleValue = cycleMatch ? parseInt(cycleMatch[0], 10) : 1;
          const cycleMonths = cycleText.includes("30日") ? 1 : cycleValue;
          return sum + sub.amount / cycleMonths;
        }, 0);

        setAverageMonthlyAmount(Math.round(totalMonthly));
      } else {
        setAverageMonthlyAmount(0);
      }
    } catch (err) {
      console.error("平均金額取得エラー:", err);
      toast.error("平均金額の取得に失敗しました");
      setAverageMonthlyAmount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchAverage();

      // 最新データを反映
      const subscription = supabase
        .channel(`realtime:subscriptions:${session.user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "subscriptions",
            filter: `user_id=eq.${session.user.id}`,
          },
          () => {
            fetchAverage();
          }
        )
        .subscribe();

      // クリーンアップ
      return () => {
        supabase.removeChannel(subscription);
      };
    } else {
      setAverageMonthlyAmount(0);
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  return (
    <SubscriptionContext.Provider
      value={{
        averageMonthlyAmount,
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
