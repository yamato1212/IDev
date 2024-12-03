// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@repo/database";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Google],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    // JWTコールバックでユーザーIDを保存
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // セッションコールバックでユーザー情報を設定
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
