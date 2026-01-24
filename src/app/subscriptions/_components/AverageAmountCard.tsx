import { Card, CardContent } from "@/components/ui/card";

interface AverageAmountCardProps {
  average: number;
  isLoading: boolean;
}

/**
 * 一覧ページ：月の平均金額を表示するカード
 */

export const AverageAmountCard = ({
  average,
  isLoading,
}: AverageAmountCardProps) => {
  return (
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
                {average.toLocaleString()}円
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
