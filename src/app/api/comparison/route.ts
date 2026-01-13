// app/api/comparison/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json(
      { error: "ログインしてください" },
      { status: 401 }
    );

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // join なしで subscriptions を取得
  const { data, error } = await supabase
    .from("subscriptions")
    .select("amount, category_id") // categories はまだ join しない
    .eq("user_id", session.user.id);

  if (error) throw error;

  const subscriptions = data || [];

  // 金額別集計
  const amountData = [
    {
      name: "～999円",
      value: subscriptions.filter((s) => s.amount <= 999).length,
    },
    {
      name: "～1,999円",
      value: subscriptions.filter((s) => s.amount > 999 && s.amount <= 1999)
        .length,
    },
    {
      name: "～2,999円",
      value: subscriptions.filter((s) => s.amount > 1999 && s.amount <= 2999)
        .length,
    },
    {
      name: "～3,999円",
      value: subscriptions.filter((s) => s.amount > 2999 && s.amount <= 3999)
        .length,
    },
    {
      name: "～4,999円",
      value: subscriptions.filter((s) => s.amount > 3999 && s.amount <= 4999)
        .length,
    },
    {
      name: "5,000円～",
      value: subscriptions.filter((s) => s.amount >= 5000).length,
    },
  ];

  // カテゴリ一覧を取得
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, category_name");

  if (catError) throw catError;

  // id → name のマップを作る
  const categoryMapName: Record<number, string> = {};
  categories?.forEach((c) => {
    categoryMapName[c.id] = c.category_name;
  });

  // subscriptions の category_id を name に変換して集計
  const categoryCount: Record<string, number> = {};
  subscriptions.forEach((s) => {
    const catName = categoryMapName[s.category_id] || "不明";
    categoryCount[catName] = (categoryCount[catName] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }));

  return NextResponse.json({ amountData, categoryData });
}
