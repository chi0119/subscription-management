// 新規登録ページ

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

const NewSubscriptionPage = () => {
  const [amount, setAmount] = useState<string>("");

  // 金額欄 カンマ区切り
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(value)) return;
    const formattedValue = Number(value).toLocaleString();
    setAmount(formattedValue);
  };

  // 共通フォーカススタイル
  const unifiedFocus =
    "border border-gray-300 focus-within:border-blue-200 focus-within:ring-1 focus-within:ring-blue-400 rounded-md shadow-sm";

  return (
    <div className="sm:w-2/3 w-full mx-auto py-5 md:py-10">
      <h1 className="text-2xl font-extrabold text-gray-600 mb-10 text-center hidden md:block">
        新規登録
      </h1>

      <div className="bg-white rounded-md shadow-sm p-8 w-full max-w-xl mx-auto">
        <form className="space-y-6">
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
                className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
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
              <Select>
                <SelectTrigger
                  id="category"
                  className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none"
                >
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">動画サービス</SelectItem>
                  <SelectItem value="music">音楽サービス</SelectItem>
                  <SelectItem value="cloud">クラウドサービス</SelectItem>
                  <SelectItem value="utility">ユーティリティ</SelectItem>
                  <SelectItem value="education">教育</SelectItem>
                  <SelectItem value="game">ゲーム</SelectItem>
                  <SelectItem value="fitness">フィットネス</SelectItem>
                  <SelectItem value="news">ニュース</SelectItem>
                  <SelectItem value="books">書籍・雑誌</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
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
                className="text-right border-none shadow-none focus-visible:ring-0 focus-visible:outline-none h-full"
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
                className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
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
              <Select>
                <SelectTrigger
                  id="paymentCycle"
                  className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none"
                >
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">30日（30日間固定）</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {i + 1}ヶ月
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
              <Select>
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
              <Select>
                <SelectTrigger
                  id="paymentMethod"
                  className="w-full h-10 border-none shadow-none focus:ring-0 focus:outline-none"
                >
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">クレジットカード</SelectItem>
                  <SelectItem value="carrier">キャリア決済</SelectItem>
                  <SelectItem value="id">ID決済</SelectItem>
                  <SelectItem value="gift">プリペイド・ギフトカード</SelectItem>
                  <SelectItem value="convenience">コンビニ・後払い</SelectItem>
                  <SelectItem value="bank">口座振替</SelectItem>
                  <SelectItem value="electronic">電子マネー</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
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
                placeholder="補足事項 など"
                rows={4}
                className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
          </div>

          {/* 登録ボタン */}
          <div className="flex justify-center pt-6">
            <Button className="py-2 px-8 bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer">
              登録
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSubscriptionPage;
