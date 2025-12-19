// 円グラフ ツールチップ

import React from "react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const name = payload[0].payload.name;
    const value = payload[0].value;

    const total = payload.reduce(
      (sum: number, entry: { value: number }) => sum + entry.value,
      0
    );

    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0";

    return (
      <div
        className="bg-white text-gray-900 p-3 rounded-lg shadow-lg text-sm border border-gray-200"
        style={{ animation: "none", transition: "none" }}
      >
        {name}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
