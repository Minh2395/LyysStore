"use client";

import { useEffect, useState } from "react";
import { Button, Image, Space, Table, Tag, notification } from "antd";
import { useSession } from "next-auth/react";

import { sendRequest } from "@/utils/api";

import ProductsCreate from "./products.create";
import ProductsDelete from "./products.delete";
import ProductsUpdate from "./products.update";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
}

interface IProduct {
  _id: string;
  id?: string;

  name: string;
  slug: string;

  base_price: number;

  status: "DRAFT" | "ACTIVE" | "INACTIVE";

  image?: string | null;

  category_id?: ICategory;

  createdAt?: string;
}

const ProductsTable = () => {
  const { data: session, status } = useSession();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [dataDelete, setDataDelete] = useState<IProduct | null>(null);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IProduct | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const getToken = () => session?.access_token;

  const fetchProducts = async (token: string) => {
    setLoading(true);

    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list = res?.data ?? res ?? [];

      setProducts(list);
      setTotal(list.length);
    } catch (err: any) {
      notification.error({
        message: "System error",
        description: err?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    const token = getToken();

    if (!token) return;

    fetchProducts(token);
  }, [session?.access_token, status]);

  const columns = [
    {
      title: "Image",
      width: 100,
      dataIndex: "image",
      render: (image: string, record: IProduct) => (
        <Image
          src={
            image
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`
              : "/images/no-image.jpg"
          }
          alt={record.name}
          width={60}
          height={60}
          preview={false}
        />
      ),
    },

    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Slug",
      dataIndex: "slug",
    },

    {
      title: "Category",
      render: (_: any, record: IProduct) => record.category_id?.name || "-",
    },

    {
      title: "Price",
      dataIndex: "base_price",
      width: 150,
      render: (price: number) => `${price.toLocaleString("vi-VN")} ₫`,
    },

    {
      title: "Status",
      width: 120,
      render: (_: any, record: IProduct) => {
        switch (record.status) {
          case "ACTIVE":
            return <Tag color="green">ACTIVE</Tag>;

          case "INACTIVE":
            return <Tag color="red">INACTIVE</Tag>;

          case "DRAFT":
            return <Tag color="gold">DRAFT</Tag>;

          default:
            return <Tag>{record.status}</Tag>;
        }
      },
    },

    {
      title: "Created",
      width: 140,
      render: (_: any, record: IProduct) =>
        record.createdAt
          ? new Date(record.createdAt).toLocaleDateString("vi-VN")
          : "-",
    },

    {
      title: "Action",
      width: 250,
      render: (_: any, record: IProduct) => (
        <Space>
          <Button type="link" href={`/dashboard/products/${record._id}`}>
            View
          </Button>

          <Button
            type="link"
            onClick={() => {
              setOpenUpdate(true);
              setDataUpdate(record);
            }}
          >
            Edit
          </Button>

          <Button
            danger
            type="link"
            onClick={() => {
              setOpenDelete(true);
              setDataDelete(record);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Manager Products
        </span>

        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Create Product
        </Button>
      </div>

      <Table
        bordered
        rowKey="_id"
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{
          current,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (page, size) => {
            setCurrent(page);
            setPageSize(size || 10);
          },
        }}
      />

      <ProductsCreate
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        reload={() => fetchProducts(getToken()!)}
      />

      <ProductsDelete
        open={openDelete}
        setOpen={setOpenDelete}
        dataDelete={dataDelete}
        reloadTable={() => fetchProducts(getToken()!)}
      />

      <ProductsUpdate
        open={openUpdate}
        setOpen={setOpenUpdate}
        dataUpdate={dataUpdate}
        reloadTable={() => fetchProducts(getToken()!)}
      />
    </>
  );
};

export default ProductsTable;
