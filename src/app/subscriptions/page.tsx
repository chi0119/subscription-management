"use client";

import { AverageAmountCard } from "./_components/AverageAmountCard";
import { LoadingSpinner } from "./_components/LoadingSpinner";
import { EmptyState } from "./_components/EmptyState";
import { useSubscriptionList } from "./_hooks/useSubscriptionList";
import { useSubscriptionCustom } from "./_hooks/useSubscriptionCustom";
import { useSubscriptionEdit } from "./_hooks/useSubscriptionEdit";
import { useSubscriptionPagination } from "./_hooks/useSubscriptionPagination";
import { DeleteConfirmDialog } from "./_components/DeleteConfirmDialog";
import { SortFilter } from "./_components/SortFilter";
import { SubscriptionPagination } from "./_components/SubscriptionPagination";
import { SubscriptionTable } from "./_components/SubscriptionTable";
import { SubscriptionCard } from "./_components/SubscriptionCard";
import { EditSubscriptionModal } from "./_components/EditSubscriptionModal";

export default function SubscriptionsPage() {
  // サブスクリストを取得するカスタムフック
  const { subscriptions, isLoading, fetchSubscriptions } =
    useSubscriptionList();

  // fetchしたデータを加工するカスタムフック
  const custom = useSubscriptionCustom(subscriptions);

  // 編集・削除
  const edit = useSubscriptionEdit(fetchSubscriptions);

  // ページネーション
  const pagination = useSubscriptionPagination(custom.sortedSubscriptions);

  // 削除確認
  const onConfirmDelete = async () => {
    const success = await edit.handleDelete();
    if (success) {
      pagination.adjustPageAfterDeletion();
    }
  };

  const loading = isLoading || custom.isMasterLoading;

  return (
    <div className="container mx-auto px-4">
      <div className="mt-5 mb-30 flex flex-col">
        {/* 月の平均金額 */}
        <AverageAmountCard
          average={custom.averageMonthlyAmount}
          isLoading={loading}
        />

        <div className="w-full mx-auto mt-3">
          {loading ? (
            // スピナー表示
            <LoadingSpinner />
          ) : (
            <>
              {subscriptions.length > 0 ? (
                <>
                  {/* 表示切替 */}
                  <SortFilter
                    value={custom.displayFilter}
                    onValueChange={custom.handleSelectChange}
                  />
                  {/* サブスク一覧 テーブル 1024px以上 */}
                  <SubscriptionTable
                    items={pagination.currentItems}
                    onEdit={edit.handleEditClick}
                    onDelete={(id: string) =>
                      edit.handleDeleteClick(Number(id))
                    }
                    formatDate={custom.formatDate}
                  />
                  {/* サブスク一覧 カード 1024px未満 */}
                  <SubscriptionCard
                    items={pagination.currentItems}
                    onEdit={edit.handleEditClick}
                    onDelete={(id: string) =>
                      edit.handleDeleteClick(Number(id))
                    }
                    formatDate={custom.formatDate}
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
            </>
          )}
        </div>
      </div>

      {/* 編集フォームモーダル */}
      <EditSubscriptionModal
        isOpen={edit.isFormOpen}
        onClose={() => {
          edit.setIsFormOpen(false);
          edit.setEditingSubscription(null);
        }}
        subscription={edit.editingSubscription}
        amount={edit.amount}
        setAmount={edit.setAmount}
        categories={custom.categories}
        paymentCycles={custom.paymentCycles}
        paymentMethods={custom.paymentMethods}
        subscriptions={subscriptions}
        onSuccess={async () => {
          await fetchSubscriptions();
        }}
      />
      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={edit.isDeleteDialogOpen}
        onOpenChange={edit.setIdDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
