import { AuthError } from "next-auth";

export class InvalidEmailPasswordError extends AuthError {
  constructor() {
    super("InvalidEmailPasswordError");
    this.name = "InvalidEmailPasswordError";
    this.message = "Email hoặc mật khẩu không hợp lệ";
  }
}

export class InActiveAccountError extends AuthError {
  constructor() {
    super("InActiveAccountError");
    this.name = "InActiveAccountError";
    this.message = "Tài khoản chưa được kích hoạt";
  }
}
