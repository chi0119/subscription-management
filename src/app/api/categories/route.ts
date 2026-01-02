import { PrismaClient } from "@/generated/prisma/client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// カテゴリー 一覧取得
export async function GET() {
  const session = await getServerSession(authOptions);
  // 確認用
  // console.log("セッション情報:", session);

  if (!session?.user?.id) {
    // 確認用
    // console.error("セッションに user.id がありません");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.categories.findMany({
    where: { user_id: BigInt(session.user.id) },
    orderBy: { id: "asc" },
  });

  const safeCategories = categories.map((C) => ({
    ...C,
    id: C.id.toString(),
    user_id: C.user_id.toString(),
  }));

  return NextResponse.json(safeCategories);
}

// カテゴリー 更新
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // 確認用
  // console.log("セッション情報:", session);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { categories } = await req.json();
    const userId = BigInt(session.user.id);
    // 確認用
    // console.log("userId:", userId);
    // console.log("categories:", categories);

    // カテゴリー 削除
    await prisma.categories.deleteMany({ where: { user_id: userId } });

    // カテゴリー 新規登録
    for (const name of categories) {
      if (name.trim() !== "") {
        await prisma.categories.create({
          data: {
            category_name: name,
            user_id: userId,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // 確認用
    // console.error("DBエラー:", error);
    return NextResponse.json(
      { error: "DB Error", details: String(error) },
      { status: 500 }
    );
  }
}
