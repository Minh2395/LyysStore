import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

import { sendRequest } from "./utils/api";
import {
  InActiveAccountError,
  InvalidEmailPasswordError,
} from "./utils/errors";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        console.log("👉 AUTHORIZE HIT");

        try {
          const res = await sendRequest<any>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
            body: {
              email: String(credentials.email),
              password: String(credentials.password),
            },
          });

          console.log("👉 LOGIN RESPONSE:", res);

          const user = res?.data?.user;
          const access_token = res?.data?.access_token;

          console.log("👉 PARSED USER:", user);
          console.log("👉 TOKEN:", access_token);

          if (!user || !access_token) {
            console.log("❌ MISSING USER OR TOKEN");
            return null;
          }

          return {
            id: user._id?.toString(),
            name: user.username,
            email: user.email,
            access_token,
            refresh_token: res?.data?.refresh_token,
            access_expire: res?.data?.access_expire,
          };
        } catch (err) {
          console.log("❌ AUTHORIZE ERROR:", err);
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

        token.access_token = u.access_token;
        token.refresh_token = u.refresh_token;
        token.access_expire = u.access_expire;

        token.user = {
          id: u.user?._id || u._id || u.id,
          name: u.user?.name || u.name || "",
          email: u.user?.email || u.email,
          role: u.user?.role || u.role,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      session.access_token = token.access_token as string;
      session.refresh_token = token.refresh_token as string;
      session.access_expire = token.access_expire as number;

      return session;
    },
  },
});
