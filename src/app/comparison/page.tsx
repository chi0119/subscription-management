// 比較ページ

"use client";

import React, { useEffect, useState } from "react";
import ComparisonPieChart from "./ComparisonPieChart";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";

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

        setAmountData(Array.isArray(json.amountData) ? json.amountData : []);
        setCategoryData(
          Array.isArray(json.categoryData) ? json.categoryData : []
        );
      } catch (err: any) {
        console.error(err);
        setError(err.message || "データ取得エラー");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // データが0件かどうかの判定
  const isDataEmpty =
    (!amountData ||
      amountData.length === 0 ||
      amountData.every((d) => d.value === 0)) &&
    (!categoryData ||
      categoryData.length === 0 ||
      categoryData.every((d) => d.value === 0));

  return (
    <div className="container mx-auto px-6">
      <PageHeader
        title="比較"
        description="登録しているサブスクを金額別・カテゴリ別に比較できます"
      />
      <div className="mt-5 mb-30 flex flex-col">
        {loading ? (
          // ローディング
          <div className="sm:w-2/3 w-full mx-auto flex flex-col items-center justify-center py-20">
            <div className="animate-spin text-emerald-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">データを読み込み中...</p>
          </div>
        ) : error ? (
          // エラー時
          <p className="text-center mt-10 text-red-500">{error}</p>
        ) : isDataEmpty ? (
          // データが0件の場合
          <div className="sm:w-2/3 w-full mx-auto mt-5 p-10 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
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
              登録されたサブスクはありません
            </p>
            <p className="text-gray-400 text-sm mt-1">
              <Link href="/new" className="text-emerald-600 hover:underline">
                新規登録ページ
              </Link>
              から追加できます
            </p>
          </div>
        ) : (
          // グラフ表示
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
        )}
      </div>
    </div>
  );
};

export default ComparisonPage;
