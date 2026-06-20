"use client";

import { useEffect, useState } from "react";
import { Table, Space, Tag, notification, Button } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import CategoriesCreate from "./categories.create";
import CategoryDelete from "./categories.delete";

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

export default function CategoryChildrenPage() {
  const params = useParams();
  const router = useRouter();

  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [parentCategory, setParentCategory] = useState<ICategory | null>(null);

  const [children, setChildren] = useState<ICategory[]>([]);

  const [openCreate, setOpenCreate] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [dataDelete, setDataDelete] = useState<ICategory | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    if (!session?.access_token) return;

    try {
      setLoading(true);

      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const categories = res?.data ?? [];

      const parent = categories.find(
        (item: ICategory) => item._id === params.id,
      );

      const childCategories = categories.filter(
        (item: ICategory) => item.parent_id?._id === params.id,
      );

      const payload = res?.data;

      const list = payload?.results ?? [];

      setParentCategory(list);
      setTotal(payload?.meta?.total ?? list.length);

      setParentCategory(parent || null);
      setChildren(childCategories);
    } catch (err: any) {
      notification.error({
        message: "Load category failed",
        description: err?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    fetchData();
  }, [status, session?.access_token]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 120,
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
      title: "Sort",
      dataIndex: "sort_order",
      width: 100,
    },
    {
      title: "Status",
      width: 120,
      render: (_: any, record: ICategory) =>
        record.is_active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Action",
      render: (_: any, record: ICategory) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              console.log(record);
            }}
          >
            View
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
        <Button
          type="link"
          onClick={() => router.push("/dashboard/categories")}
          style={{ paddingLeft: 0 }}
        >
          ← Back
        </Button>

        <div>Category: {parentCategory?.name || "Loading..."}</div>

        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Create Child
        </Button>
      </div>

      <Table
        bordered
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={children}
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

      <CategoriesCreate
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        reload={fetchData}
        parentId={params.id as string}
      />

      <CategoryDelete
        open={openDelete}
        setOpen={setOpenDelete}
        dataDelete={dataDelete}
        reloadTable={fetchData}
      />
    </>
  );
}
