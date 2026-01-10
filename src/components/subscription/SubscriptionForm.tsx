"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { Subscription } from "@/types/subscription";
import { Loader2 } from "lucide-react";

interface SubscriptionFormProps {
  amount: string;
  setAmount: (value: string) => void;
  onSubmit: (formData: any) => Promise<boolean>;
  onGoToList: () => void;
  onCheckDuplicate?: (name: string) => Promise<boolean>;
  initialData?: Subscription | null;
  isSubmitting?: boolean;
  categories?: Array<{ id: number; category_name: string }>;
  paymentCycles?: Array<{ id: number; payment_cycle_name: string }>;
  paymentMethods?: Array<{ id: number; payment_method_name: string }>;
}

export const SubscriptionForm = ({
  amount,
  setAmount,
  onSubmit,
  onGoToList,
  onCheckDuplicate,
  initialData,
  isSubmitting = false,
  categories = [],
  paymentCycles = [],
  paymentMethods = [],
}: SubscriptionFormProps) => {
  const [formData, setFormData] = useState({
    subscription_name: String(initialData?.subscription_name || ""),
    category_id: String(initialData?.category_id || ""),
    contract_date: String(initialData?.contract_date || ""),
    payment_cycle_id: String(initialData?.payment_cycle_id || ""),
    payment_date: String(initialData?.payment_date || ""),
    payment_method_id: String(initialData?.payment_method_id || ""),
    notes: String(initialData?.notes || ""),
  });
  const isEdit = !!initialData?.id;

  const buttonLabel = isSubmitting
    ? isEdit
      ? "更新中..."
      : "登録中..."
    : isEdit
    ? "更新"
    : "登録";

  const titleText = isEdit ? "この内容で更新します" : "この内容を登録します";
  const successText = isEdit ? "更新が完了しました" : "登録が完了しました";

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isDoneDialogOpen, setIsDoneDialogOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const baseContainer =
    "border rounded-md shadow-sm transition-all duration-200";

  const getContainerClass = (hasError: boolean) => {
    return `${baseContainer} w-full sm:max-w-sm ${
      hasError
        ? "border-red-400 ring-1 ring-red-400 bg-red-50"
        : "border-gray-300 focus-within:border-blue-400 focus-within:ring-0 bg-white"
    }`;
  };

  // 金額カンマ区切り
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(value)) return;
    setAmount(Number(value).toLocaleString());
  };

  // 「登録」ボタン押下時
  const handleRegisterClick = async () => {
    // バリデーション
    if (!formData.subscription_name.trim()) {
      setIsError(true);
      toast.error("サブスク名を入力してください");
      return;
    }
    setIsError(false);

    // カテゴリーの存在チェック
    const categoryExists = categories.some(
      (cat) => cat.id.toString() === formData.category_id
    );

    if (!formData.category_id || !categoryExists) {
      setIsError(true);
      toast.error(
        <div className="flex flex-col">
          <span>カテゴリーを選択してください</span>
          <span className="text-[11px] font-normal leading-tight mt-1 opacity-90">
            ※以前のカテゴリーは削除されています
          </span>
        </div>
      );
      setFormData((prev) => ({ ...prev, category_id: "" }));
      return;
    }
    setIsError(false);

    if (!amount || amount === "0") {
      setIsError(true);
      toast.error("金額を入力してください");
      return;
    }
    setIsError(false);

    if (!formData.contract_date) {
      setIsError(true);
      toast.error("契約日を選択してください");
      return;
    }
    setIsError(false);

    if (!formData.payment_cycle_id) {
      setIsError(true);
      toast.error("支払いサイクルを選択してください");
      return;
    }
    setIsError(false);

    if (!formData.payment_date) {
      setIsError(true);
      toast.error("支払日を選択してください");
      return;
    }
    setIsError(false);

    if (!formData.payment_method_id) {
      setIsError(true);
      toast.error("支払い方法を選択してください");
      return;
    }
    setIsError(false);

    // 重複チェック
    try {
      const isDuplicate = onCheckDuplicate
        ? await onCheckDuplicate(formData.subscription_name)
        : false;

      // サブスク名の重複 トーストで表示する場合
      // if (isDuplicate) {
      //   toast.error(
      //     <div className="flex flex-col">
      //       <span>サブスク名が既に登録されています。</span>
      //       <span className="text-sm opacity-80">別の名前にしてください</span>
      //     </div>
      //   );
      //   return;
      // }

      // サブスク名の重複 ダイアログで表示する場合
      if (isDuplicate) {
        setIsDuplicateDialogOpen(true);
        return;
      }

      if (isEdit) {
        // 更新時は直接保存
        await handleRegister();
      } else {
        // 新規登録時のみ、確認用ポップアップを表示
        setIsConfirmDialogOpen(true);
      }
    } catch (error) {
      console.error("重複チェックエラー:", error);
      toast.error("重複チェックに失敗しました");
    }
  };

  // 重複確認から直接登録へ進む
  const handleProceedFromDuplicate = () => {
    setIsDuplicateDialogOpen(false);
    setTimeout(() => handleRegister(), 100);
  };

  // 保存処理の実行
  const handleRegister = async () => {
    try {
      setLoadingRegister(true);

      const submitData = {
        ...formData,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        payment_cycle_id: formData.payment_cycle_id
          ? Number(formData.payment_cycle_id)
          : null,
        payment_method_id: formData.payment_method_id
          ? Number(formData.payment_method_id)
          : null,
        payment_date: formData.payment_date
          ? Number(formData.payment_date)
          : null,
        amount: Number(amount.replace(/,/g, "")),
      };
      const success = await onSubmit(submitData);

      if (success) {
        setIsConfirmDialogOpen(false);
        setIsDuplicateDialogOpen(false);

        if (isEdit) {
          // 更新時は完了ポップアップを出さない
          onGoToList();
        } else {
          // 新規登録時のみ、「登録完了」のポップアップを出す
          setTimeout(() => setIsDoneDialogOpen(true), 100);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleContinue = () => {
    setIsDoneDialogOpen(false);
    setFormData({
      subscription_name: "",
      category_id: "",
      contract_date: "",
      payment_cycle_id: "",
      payment_date: "",
      payment_method_id: "",
      notes: "",
    });
    setAmount("");
  };

  const handleGoToList = () => {
    setIsDoneDialogOpen(false);
    setTimeout(() => onGoToList(), 200);
  };

  return (
    <div className="space-y-6">
      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          box-shadow: 0 0 0 30px white inset !important;
        }
      `}</style>

      {/* サブスク名 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="subscription_name"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          サブスク名
          <span className="text-red-400 ml-1">*</span>
        </Label>
        <div
          className={getContainerClass(
            isError && !formData.subscription_name.trim()
          )}
        >
          <Input
            id="subscription_name"
            placeholder="サブスク名"
            value={formData.subscription_name}
            onChange={(e) =>
              setFormData({ ...formData, subscription_name: e.target.value })
            }
            aria-invalid={isError && formData.subscription_name.trim() === ""}
            className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* カテゴリー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="category_id"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          カテゴリー
          <span className="text-red-400 ml-1">*</span>
        </Label>
        <div className={getContainerClass(isError && !formData.category_id)}>
          <Select
            value={formData.category_id}
            onValueChange={(value) =>
              setFormData({ ...formData, category_id: value })
            }
          >
            <SelectTrigger className="w-full h-10 border-none shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none data-placeholder:text-muted-foreground">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 金額 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          金額
          <span className="text-red-400 ml-1">*</span>
        </Label>
        <div
          className={`flex items-center h-10 ${getContainerClass(
            isError && (!amount || amount === "0")
          )}`}
        >
          <Input
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            // ring-0 と focus-visible:ring-0 を両方入れて内側の線を消去
            className="text-right border-none shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none h-full bg-transparent"
          />
          <span className="inline-flex items-center justify-center px-3 text-gray-600 sm:text-sm h-full">
            円
          </span>
        </div>
      </div>

      {/* 契約日 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="contract_date"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          契約日
          <span className="text-red-400 ml-1">*</span>
        </Label>
        <div className={getContainerClass(isError && !formData.contract_date)}>
          <Input
            type="date"
            id="contract_date"
            value={formData.contract_date}
            onChange={(e) =>
              setFormData({ ...formData, contract_date: e.target.value })
            }
            className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none bg-transparent"
            aria-invalid={isError && !formData.contract_date}
          />
        </div>
      </div>

      {/* 支払いサイクル */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="payment_cycle_id"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          支払いサイクル
          <span className="text-red-400 ml-1">*</span>
        </Label>
        <div
          className={getContainerClass(isError && !formData.payment_cycle_id)}
        >
          <Select
            value={formData.payment_cycle_id}
            onValueChange={(value) =>
              setFormData({ ...formData, payment_cycle_id: value })
            }
          >
            <SelectTrigger className="w-full h-10 border-none shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none data-placeholder:text-muted-foreground">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {paymentCycles.map((cycle) => (
                <SelectItem key={cycle.id} value={cycle.id.toString()}>
                  {cycle.payment_cycle_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 支払日 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="payment_date"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          支払日
          <span className="text-red-400 ml-1">*</span>
        </Label>
        <div className={getContainerClass(isError && !formData.payment_date)}>
          <Select
            value={formData.payment_date}
            onValueChange={(value) =>
              setFormData({ ...formData, payment_date: value })
            }
          >
            <SelectTrigger className="w-full h-10 border-none shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none data-placeholder:text-muted-foreground">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}日
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 支払い方法 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="payment_method_id"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          支払い方法
          <span className="text-red-400 ml-1">*</span>
        </Label>
        <div
          className={getContainerClass(isError && !formData.payment_method_id)}
        >
          <Select
            value={formData.payment_method_id}
            onValueChange={(value) =>
              setFormData({ ...formData, payment_method_id: value })
            }
          >
            <SelectTrigger className="w-full h-10 border-none shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none data-placeholder:text-muted-foreground">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id.toString()}>
                  {method.payment_method_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 備考 */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-2">
        <Label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-600 sm:w-1/4 pt-2"
        >
          備考
        </Label>
        <div className={getContainerClass(false)}>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="補足事項 など"
            rows={4}
            className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* ボタン & ダイアログ */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleRegisterClick}
          className="py-2 px-8 bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
          disabled={loadingRegister}
        >
          {loadingRegister
            ? isEdit
              ? "更新中..."
              : "登録中..."
            : isEdit
            ? "更新"
            : "登録"}
        </Button>

        {/* サブスク名の重複 ダイアログで表示する場合 */}
        {/* 重複確認ダイアログ */}
        <AlertDialog
          open={isDuplicateDialogOpen}
          onOpenChange={setIsDuplicateDialogOpen}
        >
          <AlertDialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
            <AlertDialogHeader className="mb-4">
              <AlertDialogTitle className="text-center text-base font-normal text-gray-600">
                「{formData.subscription_name}」は既に登録されています
                <br />
                別のサブスク名に変更してください
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center flex-row">
              <AlertDialogCancel>閉じる</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 実行確認ダイアログ */}
        <AlertDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <AlertDialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
            <AlertDialogHeader className="mb-4">
              <AlertDialogTitle className="text-center text-base font-normal text-gray-600">
                この内容を登録します
                <br />
                よろしいでしょうか
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center flex-row ">
              <AlertDialogAction
                onClick={handleRegister}
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={loadingRegister}
              >
                {loadingRegister ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEdit ? "更新中..." : "登録中..."}
                  </>
                ) : isEdit ? (
                  "更新"
                ) : (
                  "登録"
                )}
              </AlertDialogAction>
              <AlertDialogCancel>いいえ</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 完了ダイアログ */}
        <AlertDialog open={isDoneDialogOpen} onOpenChange={setIsDoneDialogOpen}>
          <AlertDialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
            <AlertDialogHeader className="mb-4">
              <AlertDialogTitle className="text-center text-base font-normal text-gray-600">
                登録が完了しました
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center flex-row ">
              <Button
                onClick={handleGoToList}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                一覧へ
              </Button>

              {/* 新規登録時のみ「続けて登録」ボタンを表示する */}
              {!isEdit && (
                <Button variant="outline" onClick={handleContinue}>
                  続けて登録
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
