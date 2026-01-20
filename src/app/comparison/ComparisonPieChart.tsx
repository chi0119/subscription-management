// 円グラフ メイン

"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import CustomTooltip from "./CustomTooltip";
import RenderCustomizedLabel from "./RenderCustomizedLabel";

interface ComparisonPieChartProps {
  data: { name: string; value: number }[];
  type: "amount" | "category"; // 金額別 or カテゴリー別
}

// 円グラフ 色
const MODERN_COLORS = [
  "#fb923c", // orange-400
  "#34d399", // emerald-400
  "#60a5fa", // blue-400
  "#a3e635", // lime-400
  "#f472b6", // pink-400
  "#c084fc", // purple-400
];

// 金額別 ラベル
const AMOUNT_ORDER = [
  "～999円",
  "～1,999円",
  "～2,999円",
  "～3,999円",
  "～4,999円",
  "5,000円～",
];

// 1024px をブレイクポイントとして定義
const LG_BREAKPOINT = 1024;

const XL_BREAKPOINT = 1280;

const ComparisonPieChart: React.FC<ComparisonPieChartProps> = ({
  data,
  type,
}) => {
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [isXlLayout, setIsXlLayout] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileLayout(window.innerWidth < LG_BREAKPOINT);
      setIsXlLayout(width >= XL_BREAKPOINT);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  let sortedData: { name: string; value: number; color: string }[];

  if (type === "amount") {
    sortedData = AMOUNT_ORDER.map((category, index) => {
      const found = data.find((d) => d.name === category);
      return found
        ? {
            ...found,
            color: MODERN_COLORS[index % MODERN_COLORS.length],
          }
        : null;
    }).filter(Boolean) as { name: string; value: number; color: string }[];
  } else {
    sortedData = data.map((item, index) => ({
      ...item,
      color: MODERN_COLORS[index % MODERN_COLORS.length],
    }));
  }

  const legendPayload = sortedData.map((entry) => ({
    value: entry.name,
    type: "square" as const,
    color: entry.color,
  }));

  const CustomLegend = () => {
    let flexDirection: React.CSSProperties["flexDirection"] = "row";
    let alignItems: React.CSSProperties["alignItems"] = "flex-start";
    let justifyContent: React.CSSProperties["justifyContent"] = "flex-start";
    let padding: React.CSSProperties["padding"] = "0";
    let width: React.CSSProperties["width"] = "auto";
    let flexWrap: React.CSSProperties["flexWrap"] = "wrap";

    if (isMobileLayout) {
      // 1024px のみ縦並び
      flexDirection = "column";
      flexWrap = "nowrap";
    }

    const marginBottom = isMobileLayout ? "14px" : isXlLayout ? "0px" : "50px";
    return (
      <ul
        style={{
          display: "flex",
          flexDirection: flexDirection,
          alignItems: alignItems,
          justifyContent: justifyContent,
          listStyle: "none",
          padding: padding,
          margin: 0,
          flexWrap: flexWrap,
          gap: isMobileLayout ? "0" : "10px 30px",
          marginTop: isMobileLayout ? "2px" : "4px",
          marginBottom: marginBottom,
          width: width,
          maxWidth: "400px",
          paddingLeft:
            justifyContent === "flex-start"
              ? isMobileLayout
                ? "4px"
                : "12px"
              : "0",
        }}
      >
        {legendPayload.map((entry, index) => (
          <li
            key={`item-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "12px",
              width: "auto",
              marginBottom: isMobileLayout ? "4px" : "0",
              marginRight: isMobileLayout ? "0" : "0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: entry.color,
                marginRight: "6px",
              }}
            />
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  // データが0件の場合、描画しない
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{ width: "100%", position: "relative", paddingBottom: "70%" }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ position: "absolute" }}
        >
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={sortedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isXlLayout ? "70%" : "60%"}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
              label={(props) => (
                <RenderCustomizedLabel {...props} isMobile={isMobileLayout} />
              )}
              labelLine={false}
            >
              {sortedData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend />
    </div>
  );
};

export default ComparisonPieChart;
