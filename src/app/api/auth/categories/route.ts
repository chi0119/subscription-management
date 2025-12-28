import { PrismaClient } from "@/generated/prisma/client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// カテゴリー 一覧取得
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.categories.findMany({
    where: { user_id: BigInt(session.user.id) },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(categories);
}

// カテゴリー 更新
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { categories } = await req.json();
  const userId = BigInt(session.user.id);

  // カテゴリー 削除
  await prisma.categories.deleteMany({ where: { user_id: userId } });

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
}
