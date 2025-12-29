import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 入力チェック
        if (!credentials?.email || !credentials?.password) return null;

        // ✅ Supabaseからユーザーを取得
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .maybeSingle();

        if (error || !user) {
          console.error("❌ Supabaseユーザー取得エラー:", error);
          return null;
        }

        // ✅ bcryptでパスワード比較
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          console.warn("❌ パスワードが一致しません");
          return null;
        }

        // ✅ 認証成功：NextAuthに渡すユーザー情報
        return {
          id: user.id.toString(), // BigInt → string 変換
          email: user.email,
        };
      },
    }),
  ],

  // ✅ ここでidをJWT・セッション両方に含める
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
