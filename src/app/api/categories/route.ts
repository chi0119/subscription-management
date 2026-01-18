import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// カテゴリー 一覧取得
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = BigInt(session.user.id);

  // カテゴリーを取得
  let categories = await prisma.categories.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
  });

  // データが0件の場合、デフォルトの3つをDBに保存して再取得
  if (categories.length === 0) {
    const defaultNames = ["動画", "音楽", "本・雑誌"];

    await prisma.categories.createMany({
      data: defaultNames.map((name) => ({
        category_name: name,
        user_id: userId,
      })),
    });

    // 保存したデータを取得
    categories = await prisma.categories.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });
  }

  const safeCategories = categories.map((C) => ({
    ...C,
    id: C.id.toString(),
    user_id: C.user_id.toString(),
  }));

  return NextResponse.json(safeCategories);

  return NextResponse.json(safeCategories);
}

// カテゴリー 更新
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { categories } = await req.json();
    const userId = BigInt(session.user.id);

    // カテゴリー 登録・更新・削除処理
    for (const cat of categories) {
      const userId = BigInt(session.user.id);

      // 削除
      if (cat.id && cat.deleted) {
        await prisma.categories.update({
          where: { id: BigInt(cat.id) },
          data: { deleted_at: new Date() },
        });
        continue;
      }

      // 新規登録
      if (!cat.id || cat.id === "") {
        if (!cat.category_name || cat.category_name.trim() === "") continue;
        await prisma.categories.create({
          data: {
            category_name: cat.category_name,
            user_id: userId,
          },
        });
        continue;
      }

      // 通常更新
      await prisma.categories.update({
        where: { id: BigInt(cat.id) },
        data: {
          category_name: cat.category_name,
          deleted_at: null,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "DB Error", details: String(error) },
      { status: 500 },
    );
  }
}
