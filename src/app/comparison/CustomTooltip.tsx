// 円グラフ ツールチップ

import React from "react";
import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: {
    payload: {
      name: string;
    };
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const name = (payload[0].payload as { name: string }).name;

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
