import { SubscriptionSubmitData } from "@/components/subscription/SubscriptionForm";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * 新規ページ：
 * マスタデータ取得
 * 登録処理
 * 重複チェック
 */

export const useSubscriptionCreate = () => {
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: number; category_name: string }>
  >([]);
  const [paymentCycles, setPaymentCycles] = useState<
    Array<{ id: number; payment_cycle_name: string }>
  >([]);
  const [paymentMethods, setPaymentMethods] = useState<
    Array<{ id: number; payment_method_name: string }>
  >([]);

  const router = useRouter();

  // マスターデータ取得
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const res = await fetch("/api/subscriptions/master");

        if (res.status === 401) {
          toast.error("ログインが必要です");
          router.push("/signin");
          return;
        }

        if (!res.ok) {
          toast.error("マスターデータの取得に失敗しました");
          return;
        }

        const data = await res.json();
        setCategories(data.categories || []);
        setPaymentCycles(data.paymentCycles || []);
        setPaymentMethods(data.paymentMethods || []);
      } catch (error) {
        console.error(error);
        toast.error("通信エラーが発生しました");
      }
    };

    fetchMasters();
  }, []);

  // 登録処理
  const handleSubmit = async (
    formData: SubscriptionSubmitData,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        toast.error("ログインしてください");
        router.push("/signin");
        return false;
      }

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          `登録に失敗しました: ${errorData.error || "エラーが発生しました"}`,
        );
        return false;
      }

      return true;
    } catch (error) {
      toast.error("通信エラーが発生しました");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重複チェック
  const handleCheckDuplicate = async (name: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `/api/subscriptions/check-duplicate?name=${encodeURIComponent(name)}`,
      );
      if (!res.ok) return false;
      const data = await res.json();
      return data.isDuplicate;
    } catch (error) {
      return false;
    }
  };
  return {
    amount,
    setAmount,
    isSubmitting,
    categories,
    paymentCycles,
    paymentMethods,
    handleSubmit,
    handleCheckDuplicate,
    handleGoToList: () => {
      router.push("/subscriptions");
      router.refresh();
    },
  };
};
