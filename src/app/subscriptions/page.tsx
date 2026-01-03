// 一覧ページ

"use client";

import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash2 } from "lucide-react";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function SubscriptionsPage() {
  // 一覧を取得
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptions = async () => {
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
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // 取得したデータを一覧表示用に変換
      const formattedData = data?.map((item) => ({
        ...item,
        category_name: item.categories?.category_name,
        payment_cycle: item.payment_cycles?.payment_cycle_name,
        payment_method: item.payment_methods?.payment_method_name,
      }));

      setSubscriptions(formattedData || []);
    } catch (error) {
      console.error("データ取得エラー:", error);
      toast.error("一覧の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const [displayFilter, setDisplayFilter] = useState("");

  // 編集機能用
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [amount, setAmount] = useState("");

  // マスターデータ用
  const [categories, setCategories] = useState<any[]>([]);
  const [paymentCycles, setPaymentCycles] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  // マスターデータを取得
  useEffect(() => {
    const fetchMasters = async () => {
      const { data: cat } = await supabase
        .from("categories")
        .select("id, category_name");
      const { data: cyc } = await supabase
        .from("payment_cycles")
        .select("id, payment_cycle_name");
      const { data: met } = await supabase
        .from("payment_methods")
        .select("id, payment_method_name");
      if (cat) setCategories(cat);
      if (cyc) setPaymentCycles(cyc);
      if (met) setPaymentMethods(met);

      // 一覧を取得
      await fetchSubscriptions();
    };
    fetchMasters();
  }, []);

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

  const handleEditClick = (sub: any) => {
    setEditingSubscription({
      id: sub.id,
      subscriptionName: sub.subscription_name,
      category: String(sub.category_id),
      contractDate: sub.contract_date,
      paymentCycle: String(sub.payment_cycle_id),
      paymentDate: String(sub.payment_date),
      paymentMethod: String(sub.payment_method_id),
      notes: sub.notes || "",
    });
    setAmount(sub.amount.toLocaleString());
    setIsFormOpen(true);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubscriptions = subscriptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const allSubscriptions = subscriptions;
  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4">
        <div className="mt-5 mb-30 flex flex-col">
          {/* 月の平均金額 */}
          <div className="sm:w-2/3 w-full mx-auto">
            <Card className=" w-full bg-linear-to-b from-lime-100 to-emerald-200 text-center shadow-sm border border-lime-50 text-gray-600">
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

          {/* 表示切替 */}
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
                <TableRow className="hover:bg-transparent">
                  <TableHead className=" py-0 w-[150px] text-gray-700">
                    サブスク名
                  </TableHead>
                  <TableHead className=" text-center py-0 w-[100px] text-gray-700">
                    カテゴリー
                  </TableHead>
                  <TableHead className=" text-center py-0 w-[90px] text-gray-700">
                    金額
                  </TableHead>
                  <TableHead className="  text-center py-0 w-[100px] text-gray-700">
                    契約日
                  </TableHead>
                  <TableHead className="  text-center py-0 w-[110px] text-gray-700">
                    支払いサイクル
                  </TableHead>
                  <TableHead className="  text-center py-0 w-20 text-gray-700">
                    支払日
                  </TableHead>
                  <TableHead className="  text-center py-0 w-[120px] text-gray-700">
                    支払い方法
                  </TableHead>
                  <TableHead className="text-gray-700">備考</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentSubscriptions.map((sub) => (
                  <TableRow
                    key={sub.id}
                    className="border-t-2 border-b-2 border-gray-200"
                  >
                    <TableCell className="max-w-[150px] py-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate block">
                            {sub.subscription_name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-gray-600 border-gray-300 shadow-lg rounded p-2 max-w-xs">
                          {sub.subscription_name}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    <TableCell className="max-w-[100px] py-2 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate block">
                            {sub.category_name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-gray-600 border-gray-300 shadow-lg rounded p-2 max-w-xs">
                          {sub.category_name}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right py-2">{`${sub.amount.toLocaleString()}円`}</TableCell>
                    <TableCell className=" py-2 text-center">
                      {formatDate(sub.contract_date)}
                    </TableCell>
                    <TableCell className=" py-2 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate block">
                            {sub.payment_cycle}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-gray-600 border-gray-300 shadow-lg rounded p-2 max-w-xs">
                          {sub.payment_cycle}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className=" py-2 text-center">{`${sub.payment_date}日`}</TableCell>
                    <TableCell className="max-w-[120px] py-2 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate block">
                            {sub.payment_method || "-"}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-gray-600 border-gray-300 shadow-lg rounded p-2 max-w-xs">
                          {sub.payment_method}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    <TableCell className="max-w-[150px] py-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate block">
                            {sub.notes || "-"}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-gray-600 border-gray-300 shadow-lg rounded p-2 max-w-xs">
                          {sub.notes}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    <TableCell className="flex gap-1 justify-start  py-2 pl-1">
                      <div className="flex gap-1 justify-start">
                        <button
                          onClick={() => handleEditClick(sub)}
                          className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Pencil size={16} />
                        </button>
                        <button className="p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
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
              <Card key={sub.id} className="shadow-md border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-600 mb-1">
                        {sub.subscription_name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {sub.category_name}
                      </span>
                    </div>
                    <div className="flex gap-1 ml-3">
                      <button
                        onClick={() => handleEditClick(sub)}
                        className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Pencil size={18} />
                      </button>
                      <button className="p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">金額</span>
                      <span className=" text-gray-600">{`${sub.amount.toLocaleString()}円`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">契約日</span>
                      <span className="text-gray-600">
                        {formatDate(sub.contract_date)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">支払いサイクル</span>
                      <span className="text-gray-600">{sub.payment_cycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">支払日</span>
                      <span className="text-gray-600">
                        {sub.payment_date}日
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">支払い方法</span>
                      <span className="text-gray-600">
                        {sub.payment_method || "-"}
                      </span>
                    </div>
                    {sub.notes && (
                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-gray-600 text-xs">備考：</span>
                        <span className="text-gray-700 text-xs">
                          {sub.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ページネーション */}
          <div className="hidden lg:flex justify-center mt-8 mb-10">
            <Pagination>
              <PaginationContent className="gap-2">
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
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index + 1}>
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 text-sm font-medium transition-colors ${
                        currentPage === index + 1
                          ? "text-emerald-600 border-b-2 border-emerald-600"
                          : "text-gray-600 hover:text-emerald-500 cursor-pointer"
                      }`}
                    >
                      {index + 1}
                    </button>
                  </PaginationItem>
                ))}
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

        {/* 編集フォームモーダル */}
        {isFormOpen && editingSubscription && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setIsFormOpen(false)}
            style={{ scrollbarGutter: "stable" }}
          >
            <div
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md shadow-sm relative border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
              >
                ✕
              </button>
              <div className="px-6 py-10 md:px-10">
                <SubscriptionForm
                  amount={amount}
                  setAmount={setAmount}
                  initialData={editingSubscription}
                  categories={categories}
                  paymentCycles={paymentCycles}
                  paymentMethods={paymentMethods}
                  onGoToList={() => {
                    setIsFormOpen(false);
                    setEditingSubscription(null);
                  }}
                  onCheckDuplicate={async (name) => {
                    const isDuplicate = subscriptions.some(
                      (sub) =>
                        sub.subscription_name === name &&
                        sub.id !== editingSubscription?.id
                    );
                    return isDuplicate;
                  }}
                  onSubmit={async (values) => {
                    try {
                      // 金額からカンマを除去
                      const rawAmount = parseInt(
                        values.amount.replace(/,/g, ""),
                        10
                      );

                      // 更新処理
                      const { error } = await supabase
                        .from("subscriptions")
                        .update({
                          subscription_name: values.subscriptionName,
                          category_id: parseInt(values.category, 10),
                          amount: rawAmount,
                          contract_date: values.contractDate,
                          payment_cycle_id: parseInt(values.paymentCycle, 10),
                          payment_date: parseInt(values.paymentDate, 10),
                          payment_method_id: parseInt(values.paymentMethod, 10),
                          notes: values.notes,
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", editingSubscription.id);
                      if (error) throw error;

                      await fetchSubscriptions();

                      setIsFormOpen(false);
                      toast.success("更新しました");
                      return true;
                    } catch (error) {
                      console.error("更新エラー:", error);
                      toast.error("更新に失敗しました");
                      return false;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
