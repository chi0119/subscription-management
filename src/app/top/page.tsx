// TOPページ

import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { WalletCards } from "lucide-react";

export default function TopPage() {
  // サブスクリプションのダミーデータ
  const subscriptions = [
    { name: "サブスク1", price: "550", id: 1, isPaid: true },
    { name: "サブスク3", price: "950", id: 3, isPaid: true },
    { name: "サブスク4", price: "110", id: 4, isPaid: true },
    { name: "サブスク5", price: "1,980", id: 5, isPaid: true },
    { name: "サブスク7", price: "980", id: 7, isPaid: true },
    { name: "サブスク9", price: "550", id: 9, isPaid: true },
    { name: "サブスク10", price: "1,200", id: 10, isPaid: true },
    { name: "サブスク12", price: "800", id: 12, isPaid: true },
  ];

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mt-5 mb-30">
          <div className="flex flex-col items-center">
            <div className="sm:w-2/3 w-full">
              {/* 今月の合計金額*/}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className=" w-full bg-linear-to-b from-lime-100 to-emerald-200 text-center shadow-md border border-lime-50 text-gray-600">
                      <CardContent className="py-2 md:py-10 flex justify-center items-center px-5 gap-x-10">
                        {/* 768px以上: 横並び、768px未満: 縦並び 表示 */}
                        <div className="flex flex-col gap-4 md:flex-row md:gap-x-10">
                          <p className="lg:text-4xl md:text-3xl text-3xl whitespace-nowrap">
                            今月の合計金額
                          </p>
                          <p className="lg:text-4xl md:text-3xl text-3xl font-bold">{`${"10,000"}円`}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    sideOffset={-50}
                    className="text-sm md:text-base rounded-md shadow-md px-3"
                  >
                    <p>今月支払いのサブスク合計金額です</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 月の平均金額 */}
              <div className="flex justify-end pt-5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card className="w-auto text-center py-2 rounded-md shadow-xs">
                        <div className="flex justify-between items-center gap-4 px-5 py-0 text-gray-600">
                          <p className="text-sm md:text-base whitespace-nowrap leading-none ">
                            月の平均金額
                          </p>
                          <p className="text-sm md:text-base leading-none">{`${"10,294"}円`}</p>
                        </div>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="center"
                      sideOffset={3}
                      className="text-xs md:text-sm  rounded-md shadow-md px-3"
                    >
                      <p>1ヶ月あたりの平均金額です</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* 今月支払いのサブスク一覧 */}
              <div className=" mt-8 ">
                <div className="flex gap-2 items-center">
                  <WalletCards className="md:w-5 md:h-5 w-4 h-4 text-emerald-600" />
                  <p className="font-bold md:text-lg text-base">
                    今月支払いのサブスク一覧
                  </p>
                </div>

                {/* map で表示 */}

                {/* 768px以上: 5行×2列、768px未満: 1列 表示 */}
                <div className="grid md:grid-rows-5 md:grid-flow-col gap-x-4 gap-y-2 mt-5 grid-cols-1 md:grid-cols-[1fr_1fr]">
                  {subscriptions.map((sub, index) => {
                    return (
                      <div key={sub.id}>
                        <Card className="rounded-md shadow-xs py-1">
                          <div className="flex justify-between items-center md:py-2 px-3 py-0">
                            <p className="md:text-base text-sm text-gray-600">
                              {sub.name}
                            </p>
                            <p className="md:text-base text-sm whitespace-nowrap text-gray-600">{`${sub.price}円`}</p>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
