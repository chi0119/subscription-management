"use client";

import { PageHeader } from "@/components/page-header";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import { useSubscriptionCreate } from "./_hooks/useSubscriptionCreate";

const NewSubscriptionPage = () => {
  const {
    amount,
    setAmount,
    isSubmitting,
    categories,
    paymentCycles,
    paymentMethods,
    handleSubmit,
    handleCheckDuplicate,
    handleGoToList,
  } = useSubscriptionCreate();
  return (
    <div className="sm:w-2/3 w-full mx-auto py-5 md:py-10 px-4">
      <PageHeader title="新規登録" description="サブスクの情報を登録できます" />
      <div className="rounded-md w-full max-w-xl mx-auto">
        <SubscriptionForm
          amount={amount}
          setAmount={setAmount}
          onSubmit={handleSubmit}
          onGoToList={handleGoToList}
          onCheckDuplicate={handleCheckDuplicate}
          isSubmitting={isSubmitting}
          categories={categories}
          paymentCycles={paymentCycles}
          paymentMethods={paymentMethods}
        />
      </div>
    </div>
  );
};

export default NewSubscriptionPage;
