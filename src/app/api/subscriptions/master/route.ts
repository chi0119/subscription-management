import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@/lib/supabaseServer";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();

  const userId = session.user.id;

  // カテゴリーを取得
  let { data: categories } = await supabase
    .from("categories")
    .select("id, category_name")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("id", { ascending: false });

  // データが0件の場合、デフォルトの3つをDBに保存して再取得
  if (!categories || categories.length === 0) {
    const defaultCategories = [
      { category_name: "動画", user_id: userId },
      { category_name: "音楽", user_id: userId },
      { category_name: "本・雑誌", user_id: userId },
    ];

    // Supabaseで一括挿入
    await supabase.from("categories").insert(defaultCategories);

    // 挿入したデータを取得
    const { data: refreshedCategories } = await supabase
      .from("categories")
      .select("id, category_name")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("id", { ascending: false });

    categories = refreshedCategories;
  }

  const { data: paymentCycles } = await supabase
    .from("payment_cycles")
    .select("id, payment_cycle_name")
    .order("id");

  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("id, payment_method_name")
    .order("id");

  return Response.json({
    categories: categories || [],
    paymentCycles: paymentCycles || [],
    paymentMethods: paymentMethods || [],
  });
}
