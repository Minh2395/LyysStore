"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, notification, Select, Button } from "antd";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";

interface IUserCreateProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  reloadTable: () => void;
}

const UserCreate = ({ open, setOpen, reloadTable }: IUserCreateProps) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  const getToken = () => session?.access_token;

  // reset form khi đóng modal
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  // submit form (CHUẨN ANT DESIGN)
  const handleCreate = async (values: any) => {
    const token = getToken();
    if (!token) {
      notification.error({
        message: "Missing token",
      });
      return;
    }

    try {
      setLoading(true);

      console.log("CREATE USER PAYLOAD:", values);

      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "POST",
        body: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notification.success({
        message: "Create user successfully",
      });

      setOpen(false);
      form.resetFields();
      reloadTable();
    } catch (err: any) {
      notification.error({
        message: "Create failed",
        description: err?.message,
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
      <Form layout="vertical" form={form} onFinish={handleCreate}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input placeholder="Enter phone" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        {/* FIX ROLE (SELECT thay vì INPUT) */}
        <Form.Item label="Role" name="role" initialValue="user">
          <Select
            options={[
              { value: "USER", label: "User" },
              { value: "ADMIN", label: "Admin" },
              { value: "STAFF", label: "Staff" },
            ]}
          />
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
