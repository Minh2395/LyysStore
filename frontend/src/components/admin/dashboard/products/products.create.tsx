"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  notification,
} from "antd";
import { useSession } from "next-auth/react";

import { sendRequest } from "@/utils/api";

interface ICategory {
  _id: string;
  name: string;
}

interface IProps {
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

export default function ProductsCreate(props: IProps) {
  const { open, onClose, reload } = props;

  const { data: session } = useSession();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [basePrice, setBasePrice] = useState<number>(0);

  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    if (!open || !session?.access_token) return;

    const fetchCategories = async () => {
      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const list = res?.data?.results ?? res?.data ?? [];

        setCategories(list);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();

    form.setFieldsValue({
      status: "DRAFT",
      base_price: 0,
    });
  }, [open, session?.access_token, form]);

  const onFinish = async (values: any) => {
    if (!session?.access_token) return;

    try {
      setLoading(true);

      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          name: values.name,
          slug: values.slug,
          category_id: values.category_id,
          base_price: values.base_price,
          description: values.description,
          status: values.status,
        },
      });

      notification.success({
        message: "Create product success",
      });

      form.resetFields();

      onClose();
      reload();
    } catch (err: any) {
      notification.error({
        message: "Create product failed",
        description: err?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Product"
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
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input product name",
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

        <Form.Item
          label="Category"
          name="category_id"
          rules={[
            {
              required: true,
              message: "Please select category",
            },
          ]}
        >
          <Select
            placeholder="Select category"
            options={categories.map((item) => ({
              value: item._id,
              label: item.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Base_price"
          name="base_price"
          rules={[
            {
              required: true,
              message: "Please add base_price",
            },
          ]}
        >
          <InputNumber<number>
            value={basePrice}
            min={0}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) => Number(value?.replace(/\./g, "") || 0)}
            onChange={(value) => setBasePrice(value || 0)}
          />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select
            options={[
              {
                value: "DRAFT",
                label: "DRAFT",
              },
              {
                value: "ACTIVE",
                label: "ACTIVE",
              },
              {
                value: "INACTIVE",
                label: "INACTIVE",
              },
            ]}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
