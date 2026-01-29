"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@supabase/supabase-js";
import { AverageAmountCard } from "./_components/AverageAmountCard";
import { LoadingSpinner } from "./_components/LoadingSpinner";
import { EmptyState } from "./_components/EmptyState";
import { useSubscriptionList } from "./_hooks/useSubscriptionList";
import { useSubscriptionPagination } from "./_hooks/useSubscriptionPagination";
import { DeleteConfirmDialog } from "./_components/DeleteConfirmDialog";
import { SortFilter } from "./_components/SortFilter";
import { SubscriptionPagination } from "./_components/SubscriptionPagination";
import { SubscriptionTable } from "./_components/SubscriptionTable";
import { SubscriptionCard } from "./_components/SubscriptionCard";
import { EditSubscriptionModal } from "./_components/EditSubscriptionModal";
import { useEffect } from "react";

export default function SubscriptionsPage() {
  const list = useSubscriptionList();  
  const {
    averageMonthlyAmount,
    refreshAverage, // 追加
    subscriptions,
    sortedSubscriptions,
    isLoading,
    displayFilter,
    handleSelectChange,
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
    fetchSubscriptions,
    categories,
    paymentCycles,
    paymentMethods,
    formatDate,
  } = list;

  // ページネーション
  const pagination = useSubscriptionPagination(sortedSubscriptions);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const onConfirmDelete = async () => {
    const success = await list.handleDelete();

    if (success) {
      pagination.adjustPageAfterDeletion();

      await refreshAverage();
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4">
        <div className="mt-5 mb-30 flex flex-col">
          {/* 月の平均金額 */}
          <AverageAmountCard
            average={averageMonthlyAmount}
            isLoading={isLoading}
          />

          <div className="w-full mx-auto mt-3">
            {isLoading ? (
              // スピナー表示
              <LoadingSpinner />
            ) : subscriptions.length > 0 ? (
              <>
                {/* 表示切替 */}
                <SortFilter
                  value={displayFilter}
                  onValueChange={handleSelectChange}
                />
                {/* サブスク一覧 テーブル 1024px以上 */}
                <SubscriptionTable
                  items={pagination.currentItems}
                  onEdit={handleEditClick}
                  onDelete={(id: string) => handleDeleteClick(Number(id))}
                  formatDate={formatDate}
                />
                {/* サブスク一覧 カード 1024px未満 */}
                <SubscriptionCard
                  items={pagination.currentItems}
                  onEdit={handleEditClick}
                  onDelete={(id: string) => handleDeleteClick(Number(id))}
                  formatDate={formatDate}
                />

                {/* ページネーション */}
                {subscriptions.length > 0 && pagination.totalPages > 1 && (
                  <SubscriptionPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    getPageNumbers={pagination.getPageNumbers}
                    setCurrentPage={pagination.setCurrentPage}
                  />
                )}
              </>
            ) : (
              /* データが0件の場合 */
              <EmptyState />
            )}
          </div>
        </div>

        {/* 編集フォームモーダル */}
        <EditSubscriptionModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSubscription(null);
          }}
          subscription={editingSubscription}
          amount={amount}
          setAmount={setAmount}
          categories={categories}
          paymentCycles={paymentCycles}
          paymentMethods={paymentMethods}
          subscriptions={subscriptions}
          onSuccess={async () => {
            await fetchSubscriptions();
            await refreshAverage();
          }}
        />
      </div>

      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIdDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />
    </TooltipProvider>
  );
}
