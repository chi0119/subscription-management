import { useSession } from "next-auth/react";
import { Subscription } from "@/types/subscription";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

type SubscriptionsResponse = Omit<
  Subscription,
  "categories" | "payment_cycles" | "payment_methods"
> & {
  categories: { category_name: string } | null;
  payment_cycles: { payment_cycle_name: string } | null;
  payment_methods: { payment_method_name: string } | null;
};

/**
 * サブスクリプション一覧ページ：データ取得専用フック
 */
export const useSubscriptionList = () => {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    if (!session?.user?.id) {
      setSubscriptions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          `
          *,
          categories(category_name),
          payment_cycles(payment_cycle_name),
          payment_methods(payment_method_name)
        `
        )
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // 取得したデータを一覧表示用に変換
      const formattedData: Subscription[] = (
        (data as SubscriptionsResponse[]) || []
      ).map((item) => {
        const { categories, payment_cycles, payment_methods, ...rest } = item;
        return {
          ...rest,
          category_name: categories?.category_name || "-",
          payment_cycle: payment_cycles?.payment_cycle_name || "-",
          payment_method: payment_methods?.payment_method_name || "-",
        };
      });

      setSubscriptions(formattedData || []);
    } catch (fetchError) {
      console.error("データ取得エラー:", fetchError);
      toast.error("一覧の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // 初回データ取得
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return {
    subscriptions,
    isLoading,
    fetchSubscriptions,
  };
};

