"use client";

import { sendRequest } from "@/utils/api";
import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// ======================
// TYPES
// ======================

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface IBackendRes<T> {
  data?: T;
  message?: string;
}

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  reloadTable?: () => void;
  dataUpdate: IUser | null;
}

const UserUpdate = ({ open, setOpen, reloadTable, dataUpdate }: IProps) => {
  const { data: session } = useSession();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // fill form when dataUpdate changes
  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        _id: dataUpdate._id,
        name: dataUpdate.name,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
      });
    }
  }, [dataUpdate]);

  const onFinish = async (values: IUser) => {
    setLoading(true);

    try {
      const accessToken = (session?.user as any)?.access_token;

      const payload = {
        _id: values._id,
        name: values.name,
        email: values.email, // FIXED BUG HERE
        phone: values.phone,
      };

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "PATCH",
        body: payload,
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
      });

      if (res?.data) {
        notification.success({
          message: "Success",
          description: "Update user successfully",
        });

        setOpen(false);
        reloadTable?.();
      } else {
        notification.error({
          message: "Error",
          description: Array.isArray(res?.message)
            ? res.message[0]
            : res?.message || "Update failed",
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
      title="Update User"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="_id" hidden>
          <Input />
        </Form.Item>

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

        <Button type="primary" htmlType="submit" loading={loading} block>
          Update
        </Button>
      </Form>
    </Modal>
  );
};

export default UserUpdate;
