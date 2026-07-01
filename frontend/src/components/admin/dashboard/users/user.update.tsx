"use client";

import { sendRequest } from "@/utils/api";
import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
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

  const getToken = () => session?.access_token;

  // ======================
  // FILL FORM WHEN OPEN
  // ======================
  useEffect(() => {
    if (open && dataUpdate) {
      form.setFieldsValue({
        _id: dataUpdate._id,
        name: dataUpdate.name,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
      });
    }

    if (!open) {
      form.resetFields();
    }
  }, [open, dataUpdate]);

  // ======================
  // SUBMIT UPDATE
  // ======================
  const onFinish = async (values: IUser) => {
    const accessToken = getToken();
    if (!accessToken) {
      notification.error({
        message: "Missing token",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${values._id}`,
        method: "PATCH",
        body: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      notification.success({
        message: "Update success",
      });

      setOpen(false);
      form.resetFields();
      reloadTable?.();
    } catch (err: any) {
      notification.error({
        message: "Update failed",
        description: err?.message,
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

        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserUpdate;
