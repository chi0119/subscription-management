import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  // 認証チェック
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ isDuplicate: false });
  }

  try {
    const supabase = await createClient();

    // ユーザーIDでフィルタリング
    const { count, error } = await supabase
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("subscription_name", name)
      .eq("user_id", session.user.id);

    if (error) throw error;

    return NextResponse.json({ isDuplicate: (count ?? 0) > 0 });
  } catch (error) {
    console.error("重複チェックエラー:", error);
    return NextResponse.json({ isDuplicate: false }, { status: 500 });
  }
}
