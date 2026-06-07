"use server";

import { signIn } from "@/auth";

export async function authenticate(email: string, password: string) {
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      data: res,
    };
  } catch (error: any) {
    const errorType = error?.type || error?.name;

    if (errorType === "InvalidEmailPasswordError") {
      return {
        success: false,
        code: 1,
        message: "Email hoặc mật khẩu không đúng",
      };
    }

    if (errorType === "InActiveAccountError") {
      return {
        success: false,
        code: 2,
        message: "Tài khoản chưa được kích hoạt",
      };
    }

    return {
      success: false,
      code: 0,
      message: "Internal server error",
    };
  }
}
