import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SortFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

/**
 * 一覧ページ：表示切替（ソート）
 */

export const SortFilter = ({ value, onValueChange }: SortFilterProps) => {
  return (
    <div className="sm:w-2/3 w-full mx-auto mb-2">
      <div className="hidden lg:flex items-center justify-start gap-2 mt-7">
        <Label htmlFor="display-select">並び替え：</Label>
        <Select value={value || "newest"} onValueChange={onValueChange}>
          <SelectTrigger
            id="display-select"
            className="w-48 bg-white border-gray-300 focus:border-blue-400 focus-visible:border-blue-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none shadow-none transition-all duration-200"
          >
            <SelectValue placeholder="登録が新しい順" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">登録が新しい順</SelectItem>
            <SelectItem value="oldest">登録が古い順</SelectItem>
            <SelectItem value="price_desc">金額が高い順</SelectItem>
            <SelectItem value="price_asc">金額が低い順</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
