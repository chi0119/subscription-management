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

interface SubscriptionFormProps {
  amount: string;
  setAmount: (value: string) => void;
  onSubmit: (formData: Record<string, string>) => Promise<boolean>;
  onGoToList: () => void;
  onCheckDuplicate?: (name: string) => Promise<boolean>;
  initialData?: Record<string, string>;
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
    subscriptionName: initialData?.subscriptionName || "",
    category: initialData?.category || "",
    contractDate: initialData?.contractDate || "",
    paymentCycle: initialData?.paymentCycle || "",
    paymentDate: initialData?.paymentDate || "",
    paymentMethod: initialData?.paymentMethod || "",
    notes: initialData?.notes || "",
  });
  const isEdit = !!initialData?.subscriptionName;

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

  const unifiedFocus =
    "border border-gray-300 focus-within:border-blue-400 rounded-md shadow-sm";

  // 金額カンマ区切り
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(value)) return;
    setAmount(Number(value).toLocaleString());
  };

  // 「登録」ボタン押下時
  const handleRegisterClick = async () => {
    // バリデーション
    if (!formData.subscriptionName.trim()) {
      toast.error("サブスク名を入力してください");
      return;
    }
    if (!formData.category) {
      toast.error("カテゴリーを選択してください");
      return;
    }
    if (!amount || amount === "0") {
      toast.error("金額を入力してください");
      return;
    }
    if (!formData.contractDate) {
      toast.error("契約日を選択してください");
      return;
    }
    if (!formData.paymentCycle) {
      toast.error("支払いサイクルを選択してください");
      return;
    }
    if (!formData.paymentDate) {
      toast.error("支払日を選択してください");
      return;
    }
    if (!formData.paymentMethod) {
      toast.error("支払い方法を選択してください");
      return;
    }

    // 重複チェック
    try {
      const isDuplicate = onCheckDuplicate
        ? await onCheckDuplicate(formData.subscriptionName)
        : false;

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
    const success = await onSubmit({ ...formData, amount });
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
  };

  const handleContinue = () => {
    setIsDoneDialogOpen(false);
    setFormData({
      subscriptionName: "",
      category: "",
      contractDate: "",
      paymentCycle: "",
      paymentDate: "",
      paymentMethod: "",
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
          htmlFor="subscriptionName"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          サブスク名
        </Label>
        <div
          className={`rounded-md shadow-sm w-full sm:max-w-sm ${unifiedFocus}`}
        >
          <Input
            id="subscriptionName"
            placeholder="サブスク名"
            value={formData.subscriptionName}
            onChange={(e) =>
              setFormData({ ...formData, subscriptionName: e.target.value })
            }
            className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* カテゴリー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="category"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          カテゴリー
        </Label>
        <div
          className={`rounded-md shadow-sm w-full sm:max-w-sm ${unifiedFocus}`}
        >
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none">
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
        </Label>
        <div
          className={`flex items-center w-full sm:max-w-sm rounded-md shadow-sm ${unifiedFocus} h-10`}
        >
          <Input
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            className="text-right border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-full bg-transparent"
          />
          <span className="inline-flex items-center justify-center px-3 text-gray-600 sm:text-sm h-full">
            円
          </span>
        </div>
      </div>

      {/* 契約日 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="contractDate"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          契約日
        </Label>
        <div
          className={`rounded-md shadow-sm w-full sm:max-w-sm ${unifiedFocus}`}
        >
          <Input
            type="date"
            id="contractDate"
            value={formData.contractDate}
            onChange={(e) =>
              setFormData({ ...formData, contractDate: e.target.value })
            }
            className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* 支払いサイクル */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <Label
          htmlFor="paymentCycle"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          支払いサイクル
        </Label>
        <div
          className={`rounded-md shadow-sm w-full sm:max-w-sm ${unifiedFocus}`}
        >
          <Select
            value={formData.paymentCycle}
            onValueChange={(value) =>
              setFormData({ ...formData, paymentCycle: value })
            }
          >
            <SelectTrigger className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none">
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
          htmlFor="paymentDate"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          支払日
        </Label>
        <div
          className={`rounded-md shadow-sm w-full sm:max-w-sm ${unifiedFocus}`}
        >
          <Select
            value={formData.paymentDate}
            onValueChange={(value) =>
              setFormData({ ...formData, paymentDate: value })
            }
          >
            <SelectTrigger className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none">
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
          htmlFor="paymentMethod"
          className="block text-sm font-medium text-gray-600 sm:w-1/4"
        >
          支払い方法
        </Label>
        <div
          className={`rounded-md shadow-sm w-full sm:max-w-sm ${unifiedFocus}`}
        >
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) =>
              setFormData({ ...formData, paymentMethod: value })
            }
          >
            <SelectTrigger className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none">
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
        <div
          className={`rounded-md shadow-sm w-full sm:max-w-sm ${unifiedFocus}`}
        >
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
          disabled={isSubmitting}
        >
          {buttonLabel}
        </Button>

        {/* 重複確認ダイアログ */}
        <AlertDialog
          open={isDuplicateDialogOpen}
          onOpenChange={setIsDuplicateDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader className="mb-4">
              <AlertDialogTitle className="text-center text-base font-normal text-gray-600">
                「{formData.subscriptionName}」は既に登録されています
                <br />
                <span className="text-sm text-gray-500 font-normal">
                  このまま{isEdit ? "更新" : "登録"}してもよろしいでしょうか
                </span>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center">
              <AlertDialogAction
                onClick={handleRegister}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {isEdit ? "更新" : "登録"}
              </AlertDialogAction>
              <AlertDialogCancel>いいえ</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 実行確認ダイアログ */}
        <AlertDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader className="mb-4">
              <AlertDialogTitle className="text-center text-base font-normal text-gray-600">
                この内容を登録します
                <br />
                よろしいでしょうか
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center">
              <AlertDialogAction
                onClick={handleRegister}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                登録
              </AlertDialogAction>
              <AlertDialogCancel>いいえ</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 完了ダイアログ */}
        <AlertDialog open={isDoneDialogOpen} onOpenChange={setIsDoneDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader className="mb-4">
              <AlertDialogTitle className="text-center text-base font-normal text-gray-600">
                登録が完了しました
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center">
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
