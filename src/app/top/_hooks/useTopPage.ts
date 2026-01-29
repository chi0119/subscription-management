import { useSubscriptionData } from "@/hooks/useSubscriptionData";

/**
 * TOPページ用
 * カスタムフックからサブスク情報を取得
 * 日付順（昇順）にソート
 */
export const useTopPage = () => {
  const {
    averageMonthlyAmount,
    currentMonthTotal,
    currentSubscriptions,
    isLoading,
  } = useSubscriptionData();

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
