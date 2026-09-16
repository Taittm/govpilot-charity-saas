import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no Prisma/bcrypt) — used by middleware.
// The Credentials provider itself lives in auth.ts, which is only ever
// evaluated in the Node.js runtime (API route handlers, server components).
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
