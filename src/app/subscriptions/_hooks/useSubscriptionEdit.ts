import { Subscription } from "@/types/subscription";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

/**
 * サブスクリプション一覧ページ：編集・削除専用フック
 */
export const useSubscriptionEdit = (fetchSubscriptions: () => Promise<void>) => {
  // 編集モーダル
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [amount, setAmount] = useState("");

  // 削除ダイアログ
  const [isDeleteDialogOpen, setIdDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEditClick = (sub: Subscription) => {
    setEditingSubscription(sub);
    setAmount(sub.amount.toLocaleString());
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number | undefined) => {
    if (id === undefined) return;
    setDeletingId(id);
    setIdDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingId === null) return false;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", deletingId);

      if (error) throw error;

      toast.success("削除しました");
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

  return {
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
  };
};
