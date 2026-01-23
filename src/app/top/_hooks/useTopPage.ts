import { useSubscription } from "@/contexts/SubscriptionContext";

type SubscriptionData = ReturnType<typeof useSubscription>;

/**
 * TOPページ用
 * コンテキストからサブスク情報を取得
 * 日付順（昇順）にソート
 */
export const useTopPage = (subscriptionData: SubscriptionData) => {
  const {
    averageMonthlyAmount,
    currentMonthTotal,
    currentSubscriptions,
    isLoading,
  } = subscriptionData;

  const sortedSubscriptions = [...(currentSubscriptions || [])].sort((a, b) => {
    const dayA = a._thisMonthDays?.[0] || 0;
    const dayB = b._thisMonthDays?.[0] || 0;
    return dayA - dayB;
  });

  return {
    averageMonthlyAmount,
    currentMonthTotal,
    currentSubscriptions,
    sortedSubscriptions,
    isLoading,
  };
};
