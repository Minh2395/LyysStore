import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

import {
  InActiveAccountError,
  InvalidEmailPasswordError,
} from "./utils/errors";

import { sendRequest } from "./utils/api";

// ======================
// TYPES
// ======================

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "STAFF";
}

interface ILoginResponse {
  user: IUser;
  access_token: string;
}

// ======================
// NEXTAUTH
// ======================

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await sendRequest<any>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
            body: {
              email: String(credentials.email),
              password: String(credentials.password),
            },
          });

          console.log("LOGIN RESPONSE:", res);

          // ⚠️ FIX: support cả 2 kiểu backend trả về
          const user = res?.data?.user || res?.user;
          const token = res?.data?.access_token || res?.access_token;

          if (!user || !token) {
            console.error("Invalid login response shape:", res);
            return null;
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            access_token: token,
          };
        } catch (err: any) {
          console.error("AUTH ERROR:", err);

          const status = err?.statusCode;

          if (status === 401) {
            throw new InvalidEmailPasswordError();
          }

          if (status === 400) {
            throw new InActiveAccountError();
          }

          return null;
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;

        token.id = u.id;
        token.role = u.role;
        token.access_token = u.access_token;

        token.name = u.name;
        token.email = u.email;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as "USER" | "ADMIN" | "STAFF",
      };

      session.access_token = token.access_token as string;

      return session;
    },
  },
});
