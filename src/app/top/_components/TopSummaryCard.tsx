import { Card, CardContent } from "@/components/ui/card";

interface TopSummaryCardProps {
  total: number;
  average: number;
  isLoading: boolean;
}

export const TopSummaryCard = ({
  total,
  average,
  isLoading,
}: TopSummaryCardProps) => {
  return (
    <>
      {/* 今月の合計金額 */}
      <Card className="w-full bg-linear-to-b from-lime-100 to-emerald-200 text-center shadow-md border border-lime-50 text-gray-600">
        <CardContent className="py-6 md:py-10 flex flex-col justify-center items-center px-5 relative">
          <div className="flex flex-wrap justify-center items-center gap-4 md:flex-row md:gap-x-10">
            <p className="lg:text-4xl md:text-3xl text-2xl whitespace-nowrap">
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
              <p className="lg:text-4xl md:text-3xl text-3xl font-bold">
                {`${total.toLocaleString()}円`}
              </p>
            )}
          </div>
          <p className="absolute bottom-0 md:bottom-2 left-0 right-0 text-center text-gray-500 text-sm">
            ※今月支払いのサブスク合計金額です
          </p>
        </CardContent>
      </Card>

      {/* 月の平均金額 */}
      <div className="pt-5 flex justify-end">
        <Card className="w-auto text-center py-2 rounded-md shadow-xs">
          <div className="flex flex-col">
            <div className="flex justify-start items-center px-4 py-0 text-gray-600 gap-x-0">
              <p className="text-sm md:text-base whitespace-nowrap leading-none text-left">
                月の平均金額
              </p>

              {/* スピナーを表示 */}
              <div className="text-sm md:text-base leading-none flex justify-end items-center min-w-[80px] h-5">
                {isLoading ? (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <svg
                      className="animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      計算中...
                    </span>
                  </div>
                ) : (
                  <p>{average.toLocaleString()}円</p>
                )}
              </div>
            </div>
            <p className="text-gray-500 text-xs px-4 text-left mt-1">
              ※1ヶ月あたりの平均金額です
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};
