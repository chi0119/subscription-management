"use client";

import { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// テキストが省略（ellipsis）されているときだけ Tooltip を表示するコンポーネント
//  @param text - 表示したいテキスト
//  @param maxWidth - 省略される最大幅（デフォルト: 150px）

export const EllipsisTooltip: React.FC<{
  text?: string | null | undefined;
  maxWidth?: string;
}> = ({ text = "", maxWidth = "150px" }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // 要素が省略されているかどうかを判定
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const isEllipsisActive = el.scrollWidth > el.clientWidth;
      setShowTooltip(isEllipsisActive);
    }
  }, [text]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span ref={textRef} className="truncate block" style={{ maxWidth }}>
          {text || "-"}
        </span>
      </TooltipTrigger>

      {showTooltip && text && (
        <TooltipContent className="bg-white text-gray-600 border-gray-300 shadow-lg rounded p-2 max-w-xs whitespace-pre-line">
          {text}
        </TooltipContent>
      )}
    </Tooltip>
  );
};
