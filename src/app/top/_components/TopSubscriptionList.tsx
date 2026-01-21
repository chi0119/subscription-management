import { Card } from "@/components/ui/card";
import { WalletCards } from "lucide-react";
import { SubscriptionSummary } from "@/contexts/SubscriptionContext";

interface TopSubscriptionListProps {
  subscriptions: SubscriptionSummary[];
  isLoading: boolean;
}

/**
 * TOPページ：
 * 今月支払いのサブスク一覧を表示するコンポーネント
 */
export const TopSubscriptionList = ({
  subscriptions,
  isLoading,
}: TopSubscriptionListProps) => {
  return (
    <>
      {/* 今月支払いのサブスク一覧 */}
      <div className=" mt-8 ">
        <div className="flex gap-2 items-center">
          <WalletCards className="md:w-5 md:h-5 w-4 h-4 text-emerald-600" />
          <p className="font-bold md:text-lg text-base">
            今月支払いのサブスク一覧
          </p>
        </div>

        {/* データが0件の場合 */}
        {!isLoading && subscriptions.length === 0 ? (
          <div className="w-full mt-5 p-10 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
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
              今月支払いのサブスクはありません
            </p>
          </div>
        ) : (
          /* map で表示 */
          /* 768px以上: 5行×2列、768px未満: 1列 表示 */

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
            {subscriptions.map((sub: SubscriptionSummary) => (
              <Card key={sub.id} className="rounded-md shadow-xs py-1">
                <div className="flex justify-between items-center md:py-2 px-3 py-0">
                  <p className="md:text-base text-sm text-gray-600">
                    {sub.subscription_name}
                  </p>
                  <div className="flex items-baseline gap-3 shrink-0">
                    <p className="text-[10px] md:text-xs text-gray-400">
                      (
                      {sub._thisMonthDays
                        ?.map((d: number) => `${d}日`)
                        .join(", ")}
                      )
                    </p>
                    <p className="md:text-base text-sm whitespace-nowrap text-gray-600">
                      {(
                        sub.amount * (sub._thisMonthDays?.length || 1)
                      ).toLocaleString()}
                      円
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
