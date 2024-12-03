import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@repo/database";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(db),

  // session: { strategy: "jwt" },
  ...authConfig,
});

export * from "next-auth";
