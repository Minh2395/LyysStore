"use client";

import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
        router.push("/admin/dashboard");
      } else {
        router.push("/users/home");
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
      <Row justify="center" style={{ marginTop: 30 }}>
        <Col xs={24} md={16} lg={8}>
          <fieldset
            style={{ padding: 15, border: "1px solid #ccc", borderRadius: 5 }}
          >
            <legend>Đăng Nhập</legend>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Login
                  </Button>

                  <Button type="link" onClick={() => setChangePassword(true)}>
                    Quên mật khẩu ?
                  </Button>
                </div>
              </Form.Item>
            </Form>

            <Link href="/">
              <ArrowLeftOutlined /> Quay lại trang chủ
            </Link>

            <Divider />

            <div style={{ textAlign: "center" }}>
              Chưa có tài khoản?{" "}
              <Link href="/auth/register">Đăng ký tại đây</Link>
            </div>
          </fieldset>
        </Col>
      </Row>

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
