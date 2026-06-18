import { DefaultSession } from "next-auth";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  isVerify: boolean;
  type: string;
  role: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
    access_token?: string;
    refresh_token?: string;
    access_expire?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: any;
    access_token?: string;
    refresh_token?: string;
    access_expire?: number;
  }
}
