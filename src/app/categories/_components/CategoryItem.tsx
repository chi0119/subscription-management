import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface CategoryItemProps {
  name: string;
  isError: boolean;
  activeCount: number;
  unifiedFocus: string;
  onChange: (value: string) => void;
  onDelete: () => void;
}

/**
 * カテゴリーの管理ページ：入力欄
 */

export const CategoryItem = ({
  name,
  isError,
  activeCount,
  unifiedFocus,
  onChange,
  onDelete,
}: CategoryItemProps) => {
  const isInvalid = isError && name.trim() === "";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-full overflow-hidden ${unifiedFocus} ${
          isInvalid
            ? "border-red-400 focus-within:border-red-500 ring-1 ring-red-400"
            : ""
        }`}
      >
        <Input
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="入力してください"
          aria-invalid={isInvalid}
          className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none bg-transparent"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDelete}
        disabled={activeCount <= 1}
        className={
          activeCount <= 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
        }
      >
        <Trash2 size={20} />
      </Button>
    </div>
  );
};
