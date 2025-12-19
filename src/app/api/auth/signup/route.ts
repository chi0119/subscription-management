import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { userName, email, password } = await req.json();

    if (!userName || !email || !password) {
      return NextResponse.json(
        { error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "ユーザー登録に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "ユーザー登録に成功しました" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "サーバー内部エラーが発生しました" },
      { status: 500 }
    );
  }
}
