// 新規登録ページ

"use client";

import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import React, { useState } from "react";

const NewSubscriptionPage = () => {
  const [amount, setAmount] = useState<string>("");

  const handleSubmit = (formData: Record<string, string>) => {
    console.log("登録データ：", formData);
  };

  return (
    <div className="sm:w-2/3 w-full mx-auto py-5 md:py-10 px-4">
      <h1 className="text-2xl font-extrabold text-gray-600 mb-10 text-center hidden md:block">
        新規登録
      </h1>
      <p className="text-sm text-gray-600 mb-10 text-center">
        サブスクの情報を登録できます
      </p>

      <div className="bg-white rounded-md shadow-sm p-8 w-full max-w-xl mx-auto">
        <SubscriptionForm
          amount={amount}
          setAmount={setAmount}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default NewSubscriptionPage;
