import {
  Category,
  PaymentCycle,
  PaymentMethod,
  Subscription,
} from "@/types/subscription";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  amount: string;
  setAmount: (value: string) => void;
  categories: Category[];
  paymentCycles: PaymentCycle[];
  paymentMethods: PaymentMethod[];
  subscriptions: Subscription[];
  onSuccess: () => Promise<void>;
}

interface SubscriptionFormValues {
  subscription_name: string;
  category_id: number | null;
  amount: string | number;
  contract_date: string;
  payment_cycle_id: number | null;
  payment_date: number | string | null;
  payment_method_id: number | null;
  notes?: string | null;
}

/**
 * 編集フォームモーダル
 */

export const EditSubscriptionModal = ({
  isOpen,
  onClose,
  subscription,
  amount,
  setAmount,
  categories,
  paymentCycles,
  paymentMethods,
  subscriptions,
  onSuccess,
}: EditSubscriptionModalProps) => {
  if (!isOpen || !subscription) return null;

  const handleCheckDuplicate = async (name: string) => {
    return subscriptions.some(
      (sub) => sub.subscription_name === name && sub.id !== subscription?.id,
    );
  };

  const handleSubmit = async (values: SubscriptionFormValues) => {
    if (!subscription) return false;
    try {
      const rawAmount =
        typeof values.amount === "string"
          ? parseInt(values.amount.replace(/,/g, ""), 10)
          : values.amount;

      const { error } = await supabase
        .from("subscriptions")
        .update({
          subscription_name: values.subscription_name,
          category_id: values.category_id ?? 0,
          amount: rawAmount,
          contract_date: values.contract_date,
          payment_cycle_id: values.payment_cycle_id ?? 0,
          payment_date: values.payment_date,
          payment_method_id: values.payment_method_id ?? 0,
          notes: values.notes ?? "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id);

      if (error) throw error;
      await onSuccess();
      onClose();
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
      style={{ scrollbarGutter: "stable" }}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md shadow-sm relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          variant="link"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10 cursor-pointer [text-decoration:none] hover:[text-decoration:none]"
        >
          ✕
        </Button>

        <div className="px-6 py-10 md:px-10">
          <SubscriptionForm
            amount={amount}
            setAmount={setAmount}
            initialData={subscription}
            categories={categories}
            paymentCycles={paymentCycles}
            paymentMethods={paymentMethods}
            onGoToList={onClose}
            onCheckDuplicate={handleCheckDuplicate}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
