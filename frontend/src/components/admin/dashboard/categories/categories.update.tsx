"use client";

import { Modal, notification, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  sort_order: number;
}

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  reloadTable?: () => void;
  dataUpdate: ICategory | null;
}

const CategoryUpdate = ({ open, setOpen, reloadTable, dataUpdate }: IProps) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const getToken = () => session?.access_token;

  useEffect(() => {
    if (dataUpdate) {
      setName(dataUpdate.name || "");
      setSlug(dataUpdate.slug || "");
      setSortOrder(dataUpdate.sort_order || 0);
    }
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
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${dataUpdate._id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          name,
          slug,
          sort_order: sortOrder,
        },
      });

      notification.success({
        message: "Update success",
        description: `Category ${name} updated successfully`,
      });

      setOpen(false);
      reloadTable?.();
    } catch (err: any) {
      notification.error({
        message: "Update failed",
        description: err?.message || "Cannot update category",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Update Category"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
        />

        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug"
        />

        <Input
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => {
            const value = Number(e.target.value);

            if (value < 0) {
              setSortOrder(0);
              return;
            }

            setSortOrder(value);
          }}
          placeholder="Sort order"
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
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

export default CategoryUpdate;
