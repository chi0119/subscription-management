import { useSubscription } from "@/contexts/SubscriptionContext";

export const useTopPage = () => {
  const {
    averageMonthlyAmount,
    currentMonthTotal,
    currentSubscriptions,
    isLoading,
  } = useSubscription();

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
