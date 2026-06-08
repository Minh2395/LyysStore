"use client";

import React from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  notification,
  Row,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { sendRequest } from "@/utils/api";
import { useRouter, useParams } from "next/navigation";

// ======================
// TYPES
// ======================

interface IBackendRes<T> {
  data?: T;
  message?: string;
}

const Verify = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const id = params?.id;

  const onFinish = async (values: { code: string }) => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
        method: "POST",
        body: {
          _id: id,
          code: values.code,
        },
      });

      if (res?.data) {
        message.success("Kích hoạt tài khoản thành công!");
        router.push("/auth/login");
      } else {
        notification.error({
          message: "Verify error",
          description: Array.isArray(res?.message)
            ? res.message.join(", ")
            : res?.message || "Invalid verification code",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "System error",
        description: err?.message || "Something went wrong",
      });
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
          <legend>Kích hoạt tài khoản</legend>

          <Form onFinish={onFinish} layout="vertical">
            <Form.Item name="_id" initialValue={id} hidden>
              <Input />
            </Form.Item>

            <div>
              Mã code đã được gửi tới email đăng ký, vui lòng kiểm tra email!
            </div>

            <Divider />

            <Form.Item
              label="Code"
              name="code"
              rules={[{ required: true, message: "Please input your code!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
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

export default Verify;
