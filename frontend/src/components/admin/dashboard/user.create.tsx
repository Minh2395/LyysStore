"use client";

import { sendRequest } from "@/utils/api";
import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// ======================
// TYPES
// ======================

interface IBackendRes<T> {
  data?: T;
  message?: string;
}

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  reloadTable?: () => void;
}

interface IUserCreatePayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

const UserCreate = ({ open, setOpen, reloadTable }: IProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  // reset form when modal close
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  const onFinish = async (values: IUserCreatePayload) => {
    setLoading(true);

    try {
      const accessToken = (session?.user as any)?.access_token;

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "POST",
        body: values,
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
      });

      if (res?.data) {
        notification.success({
          message: "Success",
          description: "Create user successfully",
        });

        form.resetFields();
        setOpen(false);
        reloadTable?.();
      } else {
        notification.error({
          message: "Error",
          description: Array.isArray(res?.message)
            ? res.message[0]
            : res?.message || "Create failed",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "System error",
        description: err?.message || "Cannot connect to server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create User"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreate;
