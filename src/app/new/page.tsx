// 新規登録ページ

"use client";

import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { PageHeader } from "@/components/page-header";

const NewSubscriptionPage = () => {
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
    const fetchMasterData = async () => {
      try {
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("id, category_name")
          .order("id");

        const { data: cyclesData } = await supabase
          .from("payment_cycles_ordered")
          .select("id, payment_cycle_name");

        const { data: methodsData } = await supabase
          .from("payment_methods_ordered")
          .select("id, payment_method_name");

        setCategories(categoriesData || []);
        setPaymentCycles(cyclesData || []);
        setPaymentMethods(methodsData || []);
      } catch (error) {
        console.error("マスターデータ取得エラー:", error);
        toast.error("データの読み込みに失敗しました");
      }
    };
    fetchMasterData();
  }, []);

  // 登録処理
  const handleSubmit = async (
    formData: Record<string, string>
  ): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      const numericAmount = Number(amount.replace(/,/g, ""));
      const payload = {
        ...formData,
        amount: numericAmount,
      };

      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.status === 401) {
        toast.error("ログインしてください");
        router.push("/signin");
        return false;
      }

      if (!res.ok) {
        toast.error("登録に失敗しました");
        return false;
      }

      // toast.success("サブスクを登録しました");
      return true;
    } catch (error) {
      console.error("予期しないエラー:", error);
      toast.error("エラーが発生しました");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 一覧へ遷移
  const handleGoToList = () => {
    router.push("/subscriptions");
    router.refresh();
  };

  // 重複チェック
  const handleCheckDuplicate = async (name: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `/api/subscriptions/check-duplicate?name=${encodeURIComponent(name)}`
      );
      if (!res.ok) return false;
      const data = await res.json();
      return data.isDuplicate;
    } catch (error) {
      console.error("重複チェックエラー:", error);
      return false;
    }
  };

  return (
    <div className="sm:w-2/3 w-full mx-auto py-5 md:py-10 px-4">
      <PageHeader title="新規登録" description="サブスクの情報を登録できます" />

      <div className=" rounded-md w-full max-w-xl mx-auto">
        <SubscriptionForm
          amount={amount}
          setAmount={setAmount}
          onSubmit={handleSubmit}
          onGoToList={handleGoToList}
          onCheckDuplicate={handleCheckDuplicate}
          isSubmitting={isSubmitting}
          categories={categories}
          paymentCycles={paymentCycles}
          paymentMethods={paymentMethods}
        />
      </div>
    </div>
  );
};

export default NewSubscriptionPage;
