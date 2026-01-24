import { Subscription } from "@/types/subscription";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisTooltip } from "@/components/EllipsisTooltip";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface SubscriptionTableProps {
  items: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

/**
 * 一覧ページ：サブスク一覧 テーブル 1024px以上
 */

export const SubscriptionTable = ({
  items,
  onEdit,
  onDelete,
  formatDate,
}: SubscriptionTableProps) => {
  return (
    <div className="sm:w-2/3 w-full mx-auto mt-3 hidden lg:block">
      <Table className="text-sm leading-tight table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className=" py-0 w-[150px] text-gray-700">
              サブスク名
            </TableHead>
            <TableHead className="  py-0 w-[100px] text-gray-700">
              カテゴリー
            </TableHead>
            <TableHead className="text-center py-0 w-[90px] text-gray-700">
              金額
            </TableHead>
            <TableHead className="  py-0 w-[100px] text-gray-700">
              契約日
            </TableHead>
            <TableHead className=" py-0 w-[110px] text-gray-700">
              支払いサイクル
            </TableHead>
            <TableHead className="py-0 w-20 text-gray-700">支払日</TableHead>
            <TableHead className="py-0 w-[120px] text-gray-700">
              支払い方法
            </TableHead>
            <TableHead className="text-gray-700">備考</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((sub) => (
            <TableRow
              key={sub.id}
              className="border-t-2 border-b-2 border-gray-200"
            >
              <TableCell className="max-w-[150px] py-2">
                <EllipsisTooltip
                  text={sub.subscription_name}
                  maxWidth="150px"
                />
              </TableCell>

              <TableCell className="max-w-[100px] py-2">
                <EllipsisTooltip text={sub.category_name} maxWidth="100px" />
              </TableCell>

              <TableCell className="text-right py-2">{`${sub.amount.toLocaleString()}円`}</TableCell>

              <TableCell className=" py-2">
                {formatDate(sub.contract_date || "")}
              </TableCell>

              <TableCell className=" py-2">{sub.payment_cycle}</TableCell>

              <TableCell className=" py-2">{`${sub.payment_date}日`}</TableCell>

              <TableCell className="max-w-[120px] py-2 ">
                <EllipsisTooltip text={sub.payment_method} maxWidth="120px" />
              </TableCell>

              <TableCell className="max-w-[150px] py-2">
                <EllipsisTooltip text={sub.notes} maxWidth="150px" />
              </TableCell>

              <TableCell className="flex gap-1 justify-start  py-2 pl-1">
                <div className="flex gap-1 justify-start">
                  <Button
                    onClick={() => onEdit(sub)}
                    variant="ghost"
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    onClick={() => onDelete(String(sub.id || ""))}
                    variant="ghost"
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
