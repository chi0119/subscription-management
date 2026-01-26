"use client";

import { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const EllipsisTooltip: React.FC<{
  text?: string | null | undefined;
  maxWidth?: string;
}> = ({ text = "", maxWidth = "150px" }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const checkEllipsis = () => {
      // 誤差吸収のため +1px
      setShowTooltip(el.scrollWidth > el.clientWidth + 1);
    };

    // ✅ 初回実行（レイアウト確定を待つ）
    const timer1 = requestAnimationFrame(() => checkEllipsis());
    const timer2 = setTimeout(checkEllipsis, 200); // 遅延描画に対応

    // ✅ 幅やDOM変化の監視
    const resizeObserver = new ResizeObserver(checkEllipsis);
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(checkEllipsis);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    window.addEventListener("resize", checkEllipsis);

    return () => {
      cancelAnimationFrame(timer1);
      clearTimeout(timer2);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", checkEllipsis);
    };
  }, [text]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          ref={textRef}
          className="truncate block"
          style={{ maxWidth, minWidth: 0 }}
        >
          {text || "-"}
        </div>
      </TooltipTrigger>

      {showTooltip && text && (
        <TooltipContent className="bg-white text-gray-600 border-gray-300 shadow-lg rounded p-2 max-w-xs whitespace-pre-line">
          {text}
        </TooltipContent>
      )}
    </Tooltip>
  );
};
