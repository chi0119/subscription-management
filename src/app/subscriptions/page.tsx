// 一覧ページ

"use client";

import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Category,
  PaymentCycle,
  PaymentMethod,
  Subscription,
} from "@/types/subscription";
import { useSubscription } from "@/contexts/SubscriptionContext";

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function SubscriptionsPage() {
  const { averageMonthlyAmount, refreshAverage } = useSubscription();

  // 一覧を取得
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

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
      const formattedData: Subscription[] = (data || []).map((item: any) => ({
        ...item,
        category_name: item.categories?.category_name,
        payment_cycle: item.payment_cycles?.payment_cycle_name,
        payment_method: item.payment_methods?.payment_method_name,
      }));

      setSubscriptions(formattedData || []);

      // 月の平均金額を再計算・更新
      await refreshAverage();
    } catch (fetchError) {
      console.error("データ取得エラー:", fetchError);
      toast.error("一覧の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const [displayFilter, setDisplayFilter] = useState("");

  // 編集機能用
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [amount, setAmount] = useState("");

  // マスターデータ用
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentCycles, setPaymentCycles] = useState<PaymentCycle[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // マスターデータを取得
  useEffect(() => {
    const fetchMasters = async () => {
      setIsLoading(true);
      try {
        const { data: cat } = await supabase
          .from("categories")
          .select("id, category_name, user_id")
          .is("deleted_at", null);
        const { data: cyc } = await supabase
          .from("payment_cycles")
          .select("id, payment_cycle_name");
        const { data: met } = await supabase
          .from("payment_methods")
          .select("id, payment_method_name");

        if (cat) setCategories(cat as Category[]);
        if (cyc) setPaymentCycles(cyc as PaymentCycle[]);
        if (met) setPaymentMethods(met as PaymentMethod[]);

        await fetchSubscriptions();
      } finally {
        setIsLoading(false);
      }
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(`ja-JP`, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleEditClick = (sub: Subscription) => {
    // フォームに渡す初期値をセット
    setEditingSubscription(sub);
    // 金額表示用
    setAmount(sub.amount.toLocaleString());
    setIsFormOpen(true);
  };

  // 削除
  const [isDeleteDialogOpen, setIdDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

      const remainingTotalItems = subscriptions.length - 1;
      const newTotalPages = Math.max(
        1,
        Math.ceil(remainingTotalItems / itemsPerPage)
      );

      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error("削除エラー：", error);
      toast.error("削除に失敗しました");
    } finally {
      setIdDeleteDialogOpen(false);
      setDeletingId(null);
    }
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
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <svg
                        className="animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <span className="text-lg text-gray-500">計算中...</span>
                    </div>
                  ) : (
                    <p className="text-2xl md:text-2xl font-bold">
                      {averageMonthlyAmount.toLocaleString()}円
                    </p>
                  )}
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

          <div className="w-full mx-auto mt-3">
            {isLoading ? (
              // 読み込み中の表示
              <div className="sm:w-2/3 w-full mx-auto flex flex-col items-center justify-center py-20">
                <div className="animate-spin text-emerald-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">データを読み込み中...</p>
              </div>
            ) : subscriptions.length > 0 ? (
              <>
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
                              <button
                                className="p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleDeleteClick(sub.id)}
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
                  {currentSubscriptions.map((sub) => (
                    <Card
                      key={sub.id}
                      className="shadow-md border border-gray-200"
                    >
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
                            <button
                              className="p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleDeleteClick(sub.id)}
                            >
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
                            <span className="text-gray-600">
                              支払いサイクル
                            </span>
                            <span className="text-gray-600">
                              {sub.payment_cycle}
                            </span>
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
                              <span className="text-gray-600 text-xs">
                                備考：
                              </span>
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
                {subscriptions.length > 0 && (
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
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
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
                )}
              </>
            ) : (
              /* データが0件の場合 */
              <div className="sm:w-2/3 w-full mx-auto mt-10 p-10 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="text-gray-300 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                    <path d="M3 10h18" />
                    <path d="m15 19 2 2 4-4" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  登録されたサブスクはありません
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  新規登録ページから追加できます
                </p>
              </div>
            )}
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
                      const rawAmount = parseInt(
                        String(values.amount).replace(/,/g, ""),
                        10
                      );

                      const { error } = await supabase
                        .from("subscriptions")
                        .update({
                          subscription_name: values.subscription_name,
                          category_id: values.category_id,
                          amount: rawAmount,
                          contract_date: values.contract_date,
                          payment_cycle_id: values.payment_cycle_id,
                          payment_date: values.payment_date,
                          payment_method_id: values.payment_method_id,
                          notes: values.notes,
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", editingSubscription.id);

                      if (error) throw error;

                      await fetchSubscriptions();
                      await refreshAverage();

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

      {/* 削除確認ダイアログ */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIdDeleteDialogOpen(open);
          if (!open) setDeletingId(null);
        }}
      >
        <AlertDialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
          <AlertDialogHeader className="mb-4">
            <AlertDialogTitle className="text-center text-base font-normal text-gray-600">
              登録内容を削除します
              <br />
              よろしいでしょうか
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center flex-row ">
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              はい
            </AlertDialogAction>
            <AlertDialogCancel>いいえ</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
