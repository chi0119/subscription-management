import { Subscription } from "@/types/subscription";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionCardProps {
  items: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

/**
 * 一覧ページ：サブスク一覧 カード 1024px未満
 */

export const SubscriptionCard = ({
  items,
  onEdit,
  onDelete,
  formatDate,
}: SubscriptionCardProps) => {
  return (
    <div className="lg:hidden sm:w-2/3 w-full mx-auto mt-5 space-y-3">
      {items.map((sub) => (
        <Card key={sub.id} className="shadow-md border border-gray-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-600 mb-1">
                  {sub.subscription_name}
                </h3>
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                  {sub.category_name}
                </span>
              </div>
              <div className="flex gap-1 ml-3">
                <Button
                  onClick={() => onEdit(sub)}
                  variant="ghost"
                  className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Pencil size={18} />
                </Button>

                <Button
                  onClick={() => onDelete(String(sub.id || ""))}
                  variant="ghost"
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">金額</span>
                <span className=" text-gray-600">{`${sub.amount.toLocaleString()}円`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">契約日</span>
                <span className="text-gray-600">
                  {formatDate(sub.contract_date || "")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">支払いサイクル</span>
                <span className="text-gray-600">{sub.payment_cycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">支払日</span>
                <span className="text-gray-600">{sub.payment_date}日</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">支払い方法</span>
                <span className="text-gray-600">
                  {sub.payment_method || "-"}
                </span>
              </div>
              {sub.notes && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-600 text-xs">備考：</span>
                  <span className="text-gray-700 text-xs">{sub.notes}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
