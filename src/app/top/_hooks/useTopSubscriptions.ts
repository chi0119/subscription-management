import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import { Subscription } from "@/types/subscription";

/**
 * TOPページ用：サブスクデータ取得専用フック
 */
export const useTopSubscriptions = () => {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    if (!session?.user?.id) {
      setSubscriptions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("subscriptions")
        .select(`
          *,
          payment_cycles(payment_cycle_name)
        `)
        .eq("user_id", session.user.id);

      if (fetchError) throw fetchError;

      setSubscriptions((data as unknown as Subscription[]) || []);
    } catch (err) {
      console.error("データ取得エラー:", err);
      setError("データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return {
    subscriptions,
    isLoading,
    error,
  };
};
