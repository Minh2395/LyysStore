import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "USER" | "ADMIN" | "STAFF";
    };

    access_token: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "STAFF";
    access_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN" | "STAFF";
    access_token: string;
    name?: string;
    email?: string;
  }
}

export {};
