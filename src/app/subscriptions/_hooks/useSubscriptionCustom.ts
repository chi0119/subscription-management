import { useSession } from "next-auth/react";
import {
  Category,
  PaymentCycle,
  PaymentMethod,
  Subscription,
} from "@/types/subscription";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSubscriptionData } from "@/hooks/useSubscriptionData";
import { supabase } from "@/lib/supabaseClient";

/**
 * サブスクリプション一覧ページ：データ加工専用フック
 */
export const useSubscriptionCustom = (subscriptions: Subscription[]) => {
  const { data: session } = useSession();
  const { averageMonthlyAmount } = useSubscriptionData();

  // マスターデータ
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentCycles, setPaymentCycles] = useState<PaymentCycle[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isMasterLoading, setIsMasterLoading] = useState(true);

  // フィルター
  const [displayFilter, setDisplayFilter] = useState("");

  // マスターデータを取得
  useEffect(() => {
    const fetchMasters = async () => {
      if (!session?.user?.id) {
        setIsMasterLoading(false);
        return;
      }

      try {
        setIsMasterLoading(true);
        const [catRes, cycRes, metRes] = await Promise.all([
          supabase
            .from("categories")
            .select("id, category_name, user_id")
            .eq("user_id", session.user.id)
            .is("deleted_at", null),
          supabase
            .from("payment_cycles")
            .select("id, payment_cycle_name")
            .order("id", { ascending: true }),
          supabase.from("payment_methods").select("id, payment_method_name"),
        ]);

        if (catRes.data) setCategories(catRes.data as Category[]);
        if (cycRes.data) setPaymentCycles(cycRes.data as PaymentCycle[]);
        if (metRes.data) setPaymentMethods(metRes.data as PaymentMethod[]);
      } catch (error) {
        console.error("マスターデータ取得エラー:", error);
        toast.error("データの初期化に失敗しました");
      } finally {
        setIsMasterLoading(false);
      }
    };

    fetchMasters();
  }, [session?.user?.id]);

  // ソート済みの全リストを作成
  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => {
      const getTime = (dateStr: string | undefined | null) =>
        dateStr ? new Date(dateStr).getTime() : 0;

      switch (displayFilter) {
        case "oldest":
          return getTime(a.created_at) - getTime(b.created_at);
        case "price_desc":
          return b.amount - a.amount;
        case "price_asc":
          return a.amount - b.amount;
        default:
          return getTime(b.created_at) - getTime(a.created_at);
      }
    });
  }, [subscriptions, displayFilter]);

  const handleSelectChange = (value: string) => {
    setDisplayFilter(value);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return {
    sortedSubscriptions,
    categories,
    paymentCycles,
    paymentMethods,
    averageMonthlyAmount,
    isMasterLoading,
    displayFilter,
    handleSelectChange,
    formatDate,
  };
};
