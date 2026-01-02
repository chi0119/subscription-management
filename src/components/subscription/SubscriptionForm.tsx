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
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

interface SubscriptionFormProps {
  amount: string;
  setAmount: (value: string) => void;
  onSubmit: (formData: Record<string, string>) => Promise<boolean>;
  onGoToList: () => void; // 追加: 一覧へ遷移する関数
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

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDoneDialogOpen, setIsDoneDialogOpen] = useState(false);

  // 共通フォーカススタイル
  const unifiedFocus =
    "border border-gray-300 focus-within:border-blue-400 rounded-md shadow-sm";

  // 金額欄 カンマ区切り
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(value)) return;
    setAmount(Number(value).toLocaleString());
  };

  const handleRegister = async () => {
    const success = await onSubmit({ ...formData, amount });
    if (success) {
      setIsConfirmDialogOpen(false);

      setTimeout(() => {
        setIsDoneDialogOpen(true);
      }, 100);
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
    setTimeout(() => {
      onGoToList();
    }, 200);
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
            name="subscriptionName"
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
            <SelectTrigger
              id="category"
              className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none"
            >
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
            name="amount"
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
            name="contractDate"
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
            <SelectTrigger
              id="paymentCycle"
              className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none"
            >
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
            <SelectTrigger
              id="paymentDate"
              className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none"
            >
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
            <SelectTrigger
              id="paymentMethod"
              className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none"
            >
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

      {/* 備考欄 */}
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
            name="notes"
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

      {/* 登録ボタン & ダイアログ */}
      <div className="flex justify-center pt-6">
        {/* 登録確認用ダイアログ */}
        <AlertDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              className="py-2 px-8 bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "登録中..." : "登録"}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader className="mb-6">
              <AlertDialogTitle className="whitespace-pre-line text-center font-normal">
                この内容を登録します{"\n"}よろしいでしょうか
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

        {/* 登録完了ダイアログ */}
        <AlertDialog open={isDoneDialogOpen} onOpenChange={setIsDoneDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader className="mb-6">
              <AlertDialogTitle className="text-center font-normal">
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
              <Button variant="outline" onClick={handleContinue}>
                続けて登録
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
