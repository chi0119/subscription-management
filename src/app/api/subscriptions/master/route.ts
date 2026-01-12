import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
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

  const userId = session.user.id;

  const { data: categories } = await supabase
    .from("categories")
    .select("id, category_name")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("id");

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
