"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Switch,
  notification,
} from "antd";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";

interface ICategory {
  _id: string;
  id: string;
  name: string;
  slug: string;

  parent_id?: {
    _id: string;
    name: string;
  } | null;

  is_active: boolean;
  sort_order: number;
}

interface IProps {
  open: boolean;
  onClose: () => void;
  reload: () => void;

  // nếu truyền parentId vào => tạo category con
  parentId?: string;
}

export default function CategoriesCreate(props: IProps) {
  const { open, onClose, reload, parentId } = props;

  const { data: session } = useSession();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        is_active: true,
        sort_order: 0,
      });
    }
  }, [open, form]);

  const onFinish = async (values: any) => {
    if (!session?.access_token) return;

    try {
      setLoading(true);

      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          id: values.id,
          name: values.name,
          slug: values.slug,
          sort_order: values.sort_order,
          is_active: values.is_active,
          parent_id: parentId ?? null,
        },
      });

      notification.success({
        message: "Create category success",
      });

      form.resetFields();
      onClose();
      reload();
    } catch (err: any) {
      notification.error({
        message: "Create category failed",
        description: err?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={parentId ? "Create Child Category" : "Create Parent Category"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="ID"
          name="id"
          rules={[
            {
              required: true,
              message: "Please input id",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            {
              required: true,
              message: "Please input slug",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Sort Order" name="sort_order">
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item label="Active" name="is_active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Category
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
