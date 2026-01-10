// TOPページ
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WalletCards } from "lucide-react";

export default function TopPage() {
  const {
    averageMonthlyAmount,
    currentMonthTotal,
    currentSubscriptions,
    isLoading,
  } = useSubscription();

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mt-5 mb-30">
          <div className="flex flex-col items-center">
            <div className="sm:w-2/3 w-full">
              {/* 今月の合計金額*/}

              <Card className=" w-full bg-linear-to-b from-lime-100 to-emerald-200 text-center shadow-md border border-lime-50 text-gray-600">
                <CardContent className="py-2 md:py-10 flex flex-col justify-center items-center px-5 gap-x-10">
                  {/* 768px以上: 横並び、768px未満: 縦並び 表示 */}
                  <div className="flex flex-wrap justify-center items-center gap-4 md:flex-row md:gap-x-10">
                    <p className="lg:text-4xl md:text-3xl text-3xl whitespace-nowrap">
                      今月の合計金額
                    </p>
                    {isLoading ? (
                      <div className="flex items-center gap-3 text-emerald-600">
                        <svg
                          className="animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        <span className="lg:text-3xl md:text-2xl text-2xl  text-gray-500">
                          計算中...
                        </span>
                      </div>
                    ) : (
                      <p className="lg:text-4xl md:text-3xl text-3xl font-bold">{`${currentMonthTotal.toLocaleString()}円`}</p>
                    )}
                  </div>
                  <p className="pt-1 text-center text-gray-500 text-sm mt-2">
                    ※今月支払いのサブスク合計金額です
                  </p>
                </CardContent>
              </Card>

              {/* 月の平均金額 */}
              <div className="pt-5 flex justify-end">
                <Card className="w-auto text-center py-2 rounded-md shadow-xs">
                  <div className="flex flex-col justify-end pt-1">
                    <div className="flex justify-between items-center px-4 py-0 text-gray-600">
                      <p className="text-sm md:text-base whitespace-nowrap leading-none text-left">
                        月の平均金額
                      </p>
                      {/* スピナーを表示 */}
                      <div className="text-sm md:text-base leading-none flex justify-end items-center min-w-[90px] h-5">
                        {isLoading ? (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <svg
                              className="animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            <span className="ext-xs text-gray-500 whitespace-nowrap">
                              計算中...
                            </span>
                          </div>
                        ) : (
                          <p>{averageMonthlyAmount.toLocaleString()}円</p>
                        )}
                      </div>
                    </div>
                    <p className="pt-1 text-gray-500 text-xs mt-1 pr-1">
                      ※1ヶ月あたりの平均金額です
                    </p>
                  </div>
                </Card>
              </div>

              {/* 今月支払いのサブスク一覧 */}
              <div className=" mt-8 ">
                <div className="flex gap-2 items-center">
                  <WalletCards className="md:w-5 md:h-5 w-4 h-4 text-emerald-600" />
                  <p className="font-bold md:text-lg text-base">
                    今月支払いのサブスク一覧
                  </p>
                </div>

                {/* データが0件の場合 */}
                {!isLoading && currentSubscriptions.length === 0 ? (
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
                  <div className="grid md:grid-rows-5 md:grid-flow-col gap-x-4 gap-y-2 mt-5 grid-cols-1 md:grid-cols-[1fr_1fr]">
                    {!isLoading &&
                      currentSubscriptions?.map((sub: any) => (
                        <div key={sub.id}>
                          <Card className="rounded-md shadow-xs py-1">
                            <div className="flex justify-between items-center md:py-2 px-3 py-0">
                              <p className="md:text-base text-sm text-gray-600">
                                {sub.subscription_name}
                              </p>

                              <div className="flex items-baseline gap-3 shrink-0">
                                <p className="text-[10px] md:text-xs text-gray-400">
                                  ({sub.payment_date}日)
                                </p>

                                <p className="md:text-base text-sm whitespace-nowrap text-gray-600">
                                  {`${(
                                    sub.amount *
                                    (sub._thisMonthDays?.length || 1)
                                  ).toLocaleString()}円`}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
