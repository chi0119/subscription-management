export const runtime = "nodejs";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const body = await req.json();
  const {
    subscriptionName,
    category,
    amount,
    contractDate,
    paymentCycle,
    paymentDate,
    paymentMethod,
    notes,
  } = body;

  const numericAmount = Number(amount);

  //   デバック用
  //   console.log("受信データ:", {
  //     subscriptionName,
  //     category,
  //     amount,
  //     numericAmount,
  //   });

  if (!subscriptionName || !category || numericAmount <= 0) {
    return new Response("Invalid input", { status: 400 });
  }

  const userId = session.user.id || session.user.email;

  const { error } = await supabase.from("subscriptions").insert({
    subscription_name: subscriptionName,
    category_id: Number(category),
    amount: numericAmount,
    contract_date: contractDate || null,
    payment_cycle_id: paymentCycle ? Number(paymentCycle) : null,
    payment_date: paymentDate || null,
    payment_method_id: paymentMethod ? Number(paymentMethod) : null,
    notes: notes || null,
    user_id: userId,
  });

  if (error) {
    console.error("登録エラー:", error);
    return new Response(error.message, { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
