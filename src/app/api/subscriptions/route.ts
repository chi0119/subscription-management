export const runtime = "nodejs";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@/lib/supabaseServer";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();

  const body = await req.json();

  const {
    subscription_name,
    category_id,
    amount,
    contract_date,
    payment_cycle_id,
    payment_date,
    payment_method_id,
    notes,
  } = body;

  const numericAmount = Number(amount);

  if (
    !subscription_name ||
    !category_id ||
    isNaN(numericAmount) ||
    numericAmount <= 0
  ) {
    return new Response("Invalid input", { status: 400 });
  }

  const userId = session.user.id;

  const { error } = await supabase.from("subscriptions").insert({
    subscription_name: subscription_name,
    category_id: Number(category_id),
    amount: numericAmount,
    contract_date: contract_date || null,
    payment_cycle_id: payment_cycle_id ? Number(payment_cycle_id) : null,
    payment_date: payment_date ? Number(payment_date) : null,
    payment_method_id: payment_method_id ? Number(payment_method_id) : null,
    notes: notes || null,
    user_id: userId,
  });

  if (error) {
    console.error("登録エラー:", error);
    return new Response(error.message, { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
