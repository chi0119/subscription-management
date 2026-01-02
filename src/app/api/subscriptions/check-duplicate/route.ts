import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ isDuplicate: false });
  }

  try {
    const { count, error } = await supabase
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("subscription_name", name);

    if (error) throw error;

    return NextResponse.json({ isDuplicate: (count ?? 0) > 0 });
  } catch (error) {
    console.error("重複チェックエラー:", error);
    return NextResponse.json({ isDuplicate: false }, { status: 500 });
  }
}
