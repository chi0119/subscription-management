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

  useEffect(() => {
    // 仮の API fetch
    const fetchData = async () => {
      // ここで実際の API を fetch する
      // 例: const res = await fetch("/api/comparison");
      // const json = await res.json();

      // サンプルデータ
      setAmountData([
        { name: "～999円", value: 10 },
        { name: "～1,999円", value: 20 },
        { name: "～2,999円", value: 15 },
        { name: "～3,999円", value: 8 },
        { name: "5,000円～", value: 5 },
      ]);
      setCategoryData([
        { name: "あいうえおかきくけこ", value: 500 },
        { name: "たちつてとなにぬねの", value: 300 },
        { name: "ミュージック", value: 200 },
        { name: "カテゴリー", value: 100 },
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-6">
      <div className="mt-5 mb-30 flex flex-col">
        <div className="sm:w-2/3 w-full mx-auto">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-x-8 gap-y-15 ">
            {/* 金額別 */}
            <div className="w-full xl:w-1/2  rounded-md shadow-sm border">
              <p className="text-center mt-2">金額別</p>
              <div className=" border-gray-300 flex items-start justify-center text-gray-500 min-h-[400px] pb-2 xl:pb-10">
                <ComparisonPieChart data={amountData} type="amount" />
              </div>
            </div>

            {/* カテゴリ別 */}
            {/* lg:1024px xl:1280px */}
            <div className="w-full xl:w-1/2 rounded-md shadow-sm border">
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
