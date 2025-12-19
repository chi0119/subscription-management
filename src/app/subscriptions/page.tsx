// 一覧ページ

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Pencil, Trash2 } from "lucide-react";

import { useState } from "react";

export default function SubscriptionsPage() {
  const [displayFilter, setDisplayFilter] = useState("");

  const handleSelectChange = (value: string) => {
    if (value === "reset") {
      setDisplayFilter("");
    } else {
      setDisplayFilter(value);
    }
  };

  const formatDate = (datteString: string) => {
    const date = new Date(datteString);
    return date.toLocaleDateString(`ja-JP`, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // サンプルデータ
  const subscriptions = [
    {
      subscription_id: "1",
      subscription_name:
        "サブスク1サブスク1サブスク1サブスク1サブスク1サブスク1サブスク1サブスク1",
      category_name: "動画",
      amount: 550,
      contract_date: "2025-11-23",
      payment_cycle: 1,
      payment_date: 26,
      payment_method: "電子マネー",
      notes: "お試しで12月までで",
    },
    {
      subscription_id: "2",
      subscription_name: "サブスク2",
      category_name: "その他",
      amount: 10000,
      contract_date: "2025-10-12",
      payment_cycle: 6,
      payment_date: 31,
      payment_method: "口座振替",
      notes: "解約時に返却すること",
    },
    {
      subscription_id: "3",
      subscription_name: "サブスク3",
      category_name: "動画",
      amount: 550,
      contract_date: "2025-11-23",
      payment_cycle: 1,
      payment_date: 26,
      payment_method: "電子マネー",
      notes: "お試しで12月までで",
    },
    {
      subscription_id: "4",
      subscription_name: "サブスク4",
      category_name: "その他",
      amount: 10000,
      contract_date: "2025-10-12",
      payment_cycle: 6,
      payment_date: 31,
      payment_method: "口座振替",
      notes: "解約時に返却すること",
    },
    {
      subscription_id: "5",
      subscription_name: "サブスク5",
      category_name: "動画",
      amount: 550,
      contract_date: "2025-11-23",
      payment_cycle: 1,
      payment_date: 26,
      payment_method: "電子マネー",
      notes: "お試し",
    },
    {
      subscription_id: "6",
      subscription_name: "サブスク6",
      category_name: "その他",
      amount: 10000,
      contract_date: "2025-10-12",
      payment_cycle: 6,
      payment_date: 31,
      payment_method: "口座振替",
      notes: "解約時に返却すること",
    },
    {
      subscription_id: "7",
      subscription_name: "サブスク7",
      category_name: "その他",
      amount: 10000,
      contract_date: "2025-10-12",
      payment_cycle: 6,
      payment_date: 31,
      payment_method: "口座振替",
      notes: "解約時に返却すること",
    },
    {
      subscription_id: "8",
      subscription_name: "サブスク8",
      category_name: "その他",
      amount: 10000,
      contract_date: "2025-10-12",
      payment_cycle: 6,
      payment_date: 31,
      payment_method: "プリペイド・ギフトカード",
      notes: "解約時に返却すること",
    },
    {
      subscription_id: "9",
      subscription_name: "サブスク9",
      category_name: "その他",
      amount: 10000,
      contract_date: "2025-10-12",
      payment_cycle: 12,
      payment_date: 31,
      payment_method: "クレジットカード",
      notes: "解約時に返却すること",
    },
    {
      subscription_id: "10",
      subscription_name: "サブスク10",
      category_name: "その他",
      amount: 10000,
      contract_date: "2025-10-12",
      payment_cycle: 6,
      payment_date: 31,
      payment_method: "キャリア決済",
      notes: "解約時に返却すること",
    },
    {
      subscription_id: "11",
      subscription_name: "サブスク11",
      category_name: "その他",
      amount: 10000,
      contract_date: "2025-10-12",
      payment_cycle: 12,
      payment_date: 31,
      payment_method: "キャリア決済",
      notes: "解約時に返却すること",
    },
    {
      subscription_id: "12",
      subscription_name: "サブスク12",
      category_name: "その他",
      amount: 10000,
      contract_date: "2025-10-12",
      payment_cycle: 12,
      payment_date: 31,
      payment_method: "キャリア決済",
      notes:
        "解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること解約時に返却すること",
    },
  ];

  // ページネーション
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // 1024px以上 ページネーション
  const currentSubscriptions = subscriptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // 1024px未満　全件表示
  const allSubscriptions = subscriptions;

  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4">
      <div className="mt-5 mb-30 flex flex-col">
        {/* 月の平均金額 */}
        <div className="sm:w-2/3 w-full mx-auto">
          <Card className=" w-full bg-linear-to-b from-lime-100 to-emerald-200 text-center shadow-sm border border-lime-50 text-gray-600">
            {/* <Card className=" w-full text-center shadow-md border border-lime-500 text-gray-600"> */}
            <CardContent className="md:py-2 py-0 flex justify-center items-center px-5 gap-x-10">
              <div className="flex flex-col gap-1 md:flex-row md:gap-x-10">
                <p className="text-2xl whitespace-nowrap md:text-2xl">
                  月の平均金額
                </p>
                <p className="text-2xl md:text-2xl font-bold">{`${"10,294"}円`}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 表示切替 1024px未満 非表示*/}
        <div className="sm:w-2/3 w-full mx-auto mb-2">
          <div className="hidden lg:flex items-center justify-start gap-2 mt-7">
            <Label htmlFor="display-select">表示切替：</Label>
            <Select value={displayFilter} onValueChange={handleSelectChange}>
              <SelectTrigger id="display-select" className="w-48">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reset">--選択クリア--</SelectItem>
                <SelectItem value="category">カテゴリ別</SelectItem>
                <SelectItem value="price">金額別</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* サブスク一覧 テーブル 1024px以上 */}
        <div className="sm:w-2/3 w-full mx-auto mt-3 hidden lg:block">
          <Table className="text-sm leading-tight table-fixed">
            <TableHeader>
              <TableHead className=" py-0 w-[150px]">サブスク名</TableHead>
              <TableHead className=" text-center py-0 w-[100px]">
                カテゴリー
              </TableHead>
              <TableHead className=" text-center py-0 w-[90px]">金額</TableHead>
              <TableHead className="  text-center py-0 w-[100px]">
                契約日
              </TableHead>
              <TableHead className="  text-center py-0 w-[110px]">
                支払いサイクル
              </TableHead>
              <TableHead className="  text-center py-0 w-20">支払日</TableHead>
              <TableHead className="  text-center py-0 w-[120px]">
                支払い方法
              </TableHead>
              <TableHead>備考</TableHead>
            </TableHeader>

            <TableBody>
              {currentSubscriptions.map((sub, index) => (
                <TableRow
                  key={sub.subscription_id}
                  className="border-t-2 border-b-2 border-gray-200"
                >
                  {/* サブスク名 */}
                  <TableCell className="max-w-[150px] py-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate  block">
                          {sub.subscription_name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border-gray-300 shadow-lg rounded p-2 max-w-xs">
                        {sub.subscription_name}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* カテゴリ */}
                  <TableCell className="max-w-[90px] py-2 text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate cursor- block">
                          {sub.category_name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border-gray-300 shadow-lg rounded p-2 max-w-xs">
                        {sub.category_name}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* 金額 */}
                  <TableCell className="text-right  py-2">{`${sub.amount.toLocaleString()}円`}</TableCell>

                  {/* 契約日 */}
                  <TableCell className=" py-2 text-center">
                    {formatDate(sub.contract_date)}
                  </TableCell>

                  {/* 支払いサイクル */}
                  <TableCell className=" py-2 text-center">{`${sub.payment_cycle}ヶ月`}</TableCell>

                  {/* 支払日 */}
                  <TableCell className=" py-2 text-center">{`${sub.payment_date}日`}</TableCell>

                  {/* 支払い方法 */}
                  <TableCell className="max-w-[150px] py-2 text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate cursor- block">
                          {sub.payment_method || "-"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border-gray-300 shadow-lg rounded p-2 max-w-xs">
                        {sub.payment_method}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* 備考 */}
                  <TableCell className="max-w-[150px] py-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate cursor- block">
                          {sub.notes || "-"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border-gray-300 shadow-lg rounded p-2 max-w-xs">
                        {sub.notes}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* ボタン */}
                  <TableCell className="flex gap-1 justify-start  py-2 pl-1">
                    <div className="flex gap-1 justify-start">
                      {/* 変更ボタン */}
                      <button
                        className="p-2 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                        aria-label="変更"
                      >
                        <Pencil size={16} />
                      </button>
                      {/* 削除ボタン */}
                      <button
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
                        aria-label="削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* サブスク一覧 カード 1024px未満 */}

        <div className="lg:hidden sm:w-2/3 w-full mx-auto mt-5 space-y-3">
          {allSubscriptions.map((sub) => (
            <Card
              key={sub.subscription_id}
              className="shadow-md border border-gray-200"
            >
              <CardContent className="p-4">
                {/* ヘッダー部分 */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {sub.subscription_name}
                    </h3>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      {sub.category_name}
                    </span>
                  </div>

                  {/* ボタン */}
                  <div className="flex gap-1 ml-3">
                    {/* 変更ボタン */}
                    <button
                      className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      aria-label="変更"
                    >
                      <Pencil size={18} />
                    </button>
                    {/* 削除ボタン */}
                    <button
                      className="p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                      aria-label="削除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* カード */}
                <div className="space-y-2 text-sm">
                  {/* 金額 */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">金額</span>
                    <span className="font-semibold text-gray-800">
                      {`${sub.amount.toLocaleString()}円`}
                    </span>
                  </div>
                  {/* 契約日 */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">契約日</span>
                    <span className="text-gray-800">
                      {formatDate(sub.contract_date)}
                    </span>
                  </div>
                  {/* 支払いサイクル */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">支払いサイクル</span>
                    <span className="text-gray-800">
                      {`${sub.payment_cycle}ヶ月`}
                    </span>
                  </div>
                  {/* 支払日 */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">支払日</span>
                    <span className="text-gray-800">{sub.payment_date}日</span>
                  </div>
                  {/* 支払い方法 */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">支払い方法</span>
                    <span className="text-gray-800">
                      {sub.payment_method || "-"}
                    </span>
                  </div>
                  {/* 備考 */}
                  {sub.notes && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-gray-600 text-xs">備考：</span>
                      <span className="text-gray-700 text-xs">{sub.notes}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ページネーション 1024px未満 非表示*/}
        <div className="hidden lg:flex justify-center mt-8 mb-10">
          <Pagination>
            <PaginationContent className="gap-2">
              {/* 前へ */}
              <PaginationItem>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-emerald-500 cursor-pointer"
                  }`}
                >
                  &lt;
                </button>
              </PaginationItem>

              {/* ページ番号 */}
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "text-emerald-600 border-b-2 border-emerald-600"
                          : "text-gray-600 hover:text-emerald-500 cursor-pointer"
                      }`}
                    >
                      {page}
                    </button>
                  </PaginationItem>
                );
              })}

              {/* 次へ */}
              <PaginationItem>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-blue-500 cursor-pointer"
                  }`}
                >
                  &gt;
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
