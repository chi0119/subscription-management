// 比較ページ

"use client";

import React, { useEffect, useState } from "react";
import ComparisonPieChart from "./ComparisonPieChart";

interface PieData {
  name: string;
  value: number;
}

const ComparisonPage = () => {
  const [amountData, setAmountData] = useState<PieData[]>([]);
  const [categoryData, setCategoryData] = useState<PieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/comparison");
        if (!res.ok) throw new Error(`APIエラー: ${res.status}`);

        const json = await res.json();

        setAmountData(json.amountData);
        setCategoryData(json.categoryData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "データ取得エラー");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6">
      <div className="mt-5 mb-30 flex flex-col">
        <div className="sm:w-2/3 w-full mx-auto">
          <div className="flex flex-col xl:flex-row justify-between items-stretch gap-x-8 gap-y-15 ">
            {/* 金額別 */}
            <div className="w-full xl:w-1/2  ">
              <p className="text-center mt-2">金額別</p>
              <div className=" border-gray-300 flex items-start justify-center text-gray-500 min-h-[400px] pb-2 xl:pb-10">
                <ComparisonPieChart data={amountData} type="amount" />
              </div>
            </div>

            {/* カテゴリ別 */}
            {/* lg:1024px xl:1280px */}
            <div className="w-full xl:w-1/2 ">
              <p className="text-center mt-2">カテゴリ別</p>
              <div className=" border-gray-300 flex items-start justify-center text-gray-500 min-h-[400px] pb-2 xl:pb-10">
                <ComparisonPieChart data={categoryData} type="category" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
