"use client";

import { useEffect, useState } from "react";
import { Modal, notification, Button, Input, InputNumber, Select } from "antd";
import { useSession } from "next-auth/react";

import { sendRequest } from "@/utils/api";

interface ICategory {
  _id: string;
  name: string;
}

interface IProduct {
  _id: string;

  name: string;
  slug: string;

  category_id?: ICategory;

  base_price: number;

  status: "DRAFT" | "ACTIVE" | "INACTIVE";

  description?: string;
}

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;

  reloadTable?: () => void;

  dataUpdate: IProduct | null;
}

const ProductsUpdate = ({ open, setOpen, reloadTable, dataUpdate }: IProps) => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<ICategory[]>([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE" | "INACTIVE">(
    "DRAFT",
  );
  const [description, setDescription] = useState("");

  const getToken = () => session?.access_token;

  useEffect(() => {
    if (!open) return;

    const fetchCategories = async () => {
      const token = getToken();

      if (!token) return;

      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const list = res?.data?.results ?? res?.data ?? [];

        setCategories(list);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [open]);

  useEffect(() => {
    if (!dataUpdate) return;

    setName(dataUpdate.name || "");
    setSlug(dataUpdate.slug || "");
    setCategoryId(dataUpdate.category_id?._id || "");
    setBasePrice(dataUpdate.base_price || 0);
    setStatus(dataUpdate.status || "DRAFT");
    setDescription(dataUpdate.description || "");
  }, [dataUpdate]);

  const handleUpdate = async () => {
    const token = getToken();

    if (!token || !dataUpdate?._id) {
      notification.error({
        message: "Missing data",
      });
      return;
    }

    try {
      setLoading(true);

      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${dataUpdate._id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          name,
          slug,
          category_id: categoryId,
          base_price: basePrice,
          status,
          description,
        },
      });

      notification.success({
        message: "Update success",
        description: `Product ${name} updated successfully`,
      });

      setOpen(false);

      reloadTable?.();
    } catch (err: any) {
      notification.error({
        message: "Update failed",
        description: err?.message || "Cannot update product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Update Product"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
      width={700}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
        />

        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug"
        />

        <Select
          value={categoryId}
          placeholder="Select category"
          options={categories.map((item) => ({
            value: item._id,
            label: item.name,
          }))}
          onChange={(value) => setCategoryId(value)}
        />

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

        <Select
          value={status}
          onChange={(value) => setStatus(value)}
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

        <Input.TextArea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 15,
        }}
      >
        <Button onClick={() => setOpen(false)} style={{ flex: 1 }}>
          Cancel
        </Button>

        <Button
          type="primary"
          loading={loading}
          onClick={handleUpdate}
          style={{ flex: 1 }}
        >
          Update
        </Button>
      </div>
    </Modal>
  );
};

export default ProductsUpdate;
