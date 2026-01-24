import { useSession } from "next-auth/react";
import {
  Category,
  PaymentCycle,
  PaymentMethod,
  Subscription,
} from "@/types/subscription";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

/**
 * 一覧ページ：データ管理
 */

export const useSubscriptionList = () => {
  const { data: session } = useSession();
  const { averageMonthlyAmount, refreshAverage } = useSubscription();

  // 一覧を取得
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayFilter, setDisplayFilter] = useState("");

  type SubscriptionsResponse = Omit<
    Subscription,
    "categories" | "payment_cycles" | "payment_methods"
  > & {
    categories: { category_name: string } | null;
    payment_cycles: { payment_cycle_name: string } | null;
    payment_methods: { payment_method_name: string } | null;
  };

  const fetchSubscriptions = useCallback(async () => {
    if (!session?.user?.id) return;
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
        `,
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

      // 月の平均金額を再計算・更新
      await refreshAverage();
    } catch (fetchError) {
      console.error("データ取得エラー:", fetchError);
      toast.error("一覧の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // マスターデータ用
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentCycles, setPaymentCycles] = useState<PaymentCycle[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // マスターデータを取得
  useEffect(() => {
    const fetchMasters = async () => {
      if (!session?.user?.id) return;
      setIsLoading(true);
      try {
        const [catRes, cycRes, metRes] = await Promise.all([
          supabase
            .from("categories")
            .select("id, category_name, user_id")
            .eq("user_id", session?.user?.id)
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

        await fetchSubscriptions();
      } catch (error) {
        console.error("マスターデータ取得エラー:", error);
        toast.error("データの初期化に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    if (session?.user?.id) {
      fetchMasters();
    }
  }, [session?.user?.id, fetchSubscriptions]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(`ja-JP`, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSelectChange = (value: string) => {
    setDisplayFilter(value);
  };

  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [amount, setAmount] = useState("");

  const handleEditClick = (sub: Subscription) => {
    // フォームに渡す初期値をセット
    setEditingSubscription(sub);
    // 金額表示用
    setAmount(sub.amount.toLocaleString());
    setIsFormOpen(true);
  };

  const [isDeleteDialogOpen, setIdDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (id: number | undefined) => {
    if (id === undefined) return;
    setDeletingId(id);
    setIdDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingId === null) return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", deletingId);

      if (error) throw error;

      toast.success("削除しました");
      // 一覧を再取得
      await fetchSubscriptions();
      return true;
    } catch (error) {
      console.error("削除エラー：", error);
      toast.error("削除に失敗しました");
      return false;
    } finally {
      setIdDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  // ソート済みの全リストを作成
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
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
  return {
    subscriptions,
    sortedSubscriptions,
    isLoading,
    displayFilter,
    handleSelectChange,
    isFormOpen,
    setIsFormOpen,
    editingSubscription,
    setEditingSubscription,
    amount,
    setAmount,
    isDeleteDialogOpen,
    setIdDeleteDialogOpen,
    handleEditClick,
    handleDeleteClick,
    handleDelete,
    fetchSubscriptions,
    categories,
    setCategories,
    paymentCycles,
    setPaymentCycles,
    paymentMethods,
    setPaymentMethods,
    setIsLoading,
    formatDate,
  };
};
