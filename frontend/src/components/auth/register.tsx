"use client";

import React, { useState } from "react";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";

// ======================
// TYPES
// ======================

interface IBackendRes<T> {
  data?: T;
  message?: string;
}

interface IRegisterResponse {
  _id: string;
}

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    email: string;
    password: string;
    name?: string;
  }) => {
    setLoading(true);

    try {
      const res = await sendRequest<IBackendRes<IRegisterResponse>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
        method: "POST",
        body: values,
      });

      const userId = res?.data?._id;

      if (!userId) {
        notification.error({
          message: "Register failed",
          description: res?.message || "Invalid server response",
        });
        return;
      }

      notification.success({
        message: "Register success",
        description: "Please verify your account",
      });

      router.push(`/verify/${userId}`);
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
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: 15,
            margin: 5,
            border: "1px solid #ccc",
            borderRadius: 5,
          }}
        >
          <legend>Đăng Ký Tài Khoản</legend>

          <Form
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>

          <Link href="/">
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>

          <Divider />

          <div style={{ textAlign: "center" }}>
            Đã có tài khoản? <Link href="/auth/login">Đăng nhập</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default Register;
