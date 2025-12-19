// 円グラフ ラベルの条件分岐

import React, { useState, useEffect, useRef } from "react";

interface LabelRenderProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  value: number;
  fill: string;
}

const RADIAN = Math.PI / 180;

// 10%未満はラベル非表示
const MIN_PERCENT_FOR_INSIDE = 0.1;

// ラベル最大文字数
const MAX_NAME_LENGTH = 7;

const RenderCustomizedLabel = (props: LabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;

  const [isMobile, setIsMobile] = useState(false);

  // 1024px 未満はラベル非表示
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // 10%未満はラベル非表示
  if (isMobile || percent < MIN_PERCENT_FOR_INSIDE) return null;

  // 内側ラベルの座標計算
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const innerX = cx + radius * Math.cos(-midAngle * RADIAN);
  const innerY = cy + radius * Math.sin(-midAngle * RADIAN);

  // ラベル最大文字数 7文字以上省略
  const displayName =
    name.length > MAX_NAME_LENGTH
      ? name.substring(0, MAX_NAME_LENGTH) + "..."
      : name;

  return (
    <text
      x={innerX}
      y={innerY}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "11px", fontWeight: "bold", pointerEvents: "none" }}
    >
      {displayName}
    </text>
  );
};

export default RenderCustomizedLabel;
