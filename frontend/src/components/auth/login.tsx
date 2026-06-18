"use client";

import { Button, Divider, Form, Input, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../../static/css/auth/login.css";
import { GoogleOutlined, FacebookFilled } from "@ant-design/icons";

import ModalReactive from "./modal.reactive";
import ModalChangePassword from "./modal.change.password";

const Login = () => {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const { email, password } = values;

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        notification.error({
          message: "Login failed",
          description: res?.error || "Unknown error",
        });

        if (res?.error === "InActiveAccountError") {
          setIsModalOpen(true);
          setUserEmail(email);
        }

        return;
      }

      await new Promise((r) => setTimeout(r, 300));

      // lấy session sau login
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      const role = session?.user?.role;

      notification.success({
        message: "Login successful",
      });

      form.resetFields();

      // ✅ ROUTE THEO ROLE
      if (role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }

      router.refresh();
    } catch (err: any) {
      notification.error({
        message: "System error",
        description: err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        {/* Banner bên trái */}
        <div className="login-banner">
          <img
            src="/images/login-banner.jpg"
            alt="Login Banner"
            className="login-banner-image"
          />
        </div>

        {/* Form bên phải */}
        <div className="login-content">
          <div className="login-title">
            <h2>Đăng nhập</h2>
            <p>Hãy đăng nhập để được hưởng đặc quyền riêng dành cho bạn</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="login-form"
          >
            <Form.Item
              label="TÀI KHOẢN"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
              ]}
            >
              <Input placeholder="Nhập tài khoản" />
            </Form.Item>

            <Form.Item
              label="MẬT KHẨU"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <div className="remember-row">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lưu tài khoản</label>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="login-btn"
            >
              Đăng nhập
            </Button>
          </Form>

          <div className="forgot-password">
            <Button type="link" onClick={() => setChangePassword(true)}>
              Quên mật khẩu ?
            </Button>
          </div>

          <Divider>
            <span style={{ color: "#999" }}>Hoặc</span>
          </Divider>

          <div className="social-login">
            <Button
              block
              size="large"
              className="google-btn"
              onClick={() => signIn("google")}
            >
              <GoogleOutlined />
              Đăng nhập bằng Google
            </Button>

            <Button
              block
              size="large"
              className="facebook-btn"
              onClick={() => signIn("facebook")}
            >
              <FacebookFilled />
              Đăng nhập bằng Facebook
            </Button>
          </div>

          <div className="register-link">
            <p>Bạn chưa có tài khoản?</p>

            <Link href="/auth/register">Đăng ký ngay</Link>
          </div>

          <div className="back-home">
            <Link href="/">
              <ArrowLeftOutlined />
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>

      <ModalReactive
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userEmail={userEmail}
      />

      <ModalChangePassword
        isModalOpen={changePassword}
        setIsModalOpen={setChangePassword}
      />
    </>
  );
};

export default Login;
