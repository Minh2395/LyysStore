"use client";

import { useEffect, useState } from "react";
import { Button, Space, Table, Tag, notification } from "antd";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import CategoriesCreate from "./categories.create";
import CategoryDelete from "./categories.delete";
import CategoryUpdate from "./categories.update";

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

  children?: ICategory[];
}

const CategoryTable = () => {
  const { data: session, status } = useSession();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [dataDelete, setDataDelete] = useState<ICategory | null>(null);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ICategory | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const getToken = () => session?.access_token;

  const fetchCategories = async (token: string) => {
    setLoading(true);

    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allCategories = res?.data ?? [];

      const payload = res?.data;

      const list = payload?.results ?? [];

      setCategories(list);
      setTotal(payload?.meta?.total ?? list.length);

      // chỉ lấy category cha
      const parentCategories = allCategories.filter(
        (item: ICategory) => !item.parent_id,
      );

      setCategories(parentCategories);
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

    fetchCategories(token);
  }, [session?.access_token, status]);

  // ======================
  // BUILD TREE DATA
  // ======================
  const buildTreeData = (data: ICategory[]): ICategory[] => {
    const parentCategories = data.filter((item) => !item.parent_id);

    return parentCategories.map((parent) => ({
      ...parent,
      children: data.filter((child) => child.parent_id?._id === parent._id),
    }));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 120,
    },
    {
      title: "Name",
      render: (_: any, record: ICategory) => (
        <span
          style={{
            fontWeight: !record.parent_id ? 700 : 400,
          }}
        >
          {record.name}
        </span>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Parent",
      render: (_: any, record: ICategory) => record.parent_id?.name || "-",
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
      width: 250,
      render: (_: any, record: ICategory) => (
        <Space>
          <Button type="link" href={`/dashboard/categories/${record._id}`}>
            View Children
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
          Manager Categories
        </span>

        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Create Category
        </Button>
      </div>

      <Table
        bordered
        rowKey="_id"
        columns={columns}
        dataSource={categories}
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

      <CategoriesCreate
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        reload={() => fetchCategories(getToken()!)}
      />

      <CategoryDelete
        open={openDelete}
        setOpen={setOpenDelete}
        dataDelete={dataDelete}
        reloadTable={() => fetchCategories(getToken()!)}
      />

      <CategoryUpdate
        open={openUpdate}
        setOpen={setOpenUpdate}
        reloadTable={() => fetchCategories(getToken()!)}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default CategoryTable;
