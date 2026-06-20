"use client";

import { useEffect, useState } from "react";
import { Button, Modal, Space, Table, notification } from "antd";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import UserCreate from "./user.create";
import UserUpdate from "./user.update";
import UserDelete from "./user.delete";

// ======================
// TYPES
// ======================

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

const UserTable = () => {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IUser | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [dataDelete, setDataDelete] = useState<IUser | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const getToken = () => session?.access_token;

  // ======================
  // FETCH USERS
  // ======================
  const fetchUsers = async (token: string) => {
    setLoading(true);

    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "GET",
        queryParams: { current, pageSize },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = res?.data;

      const list = payload?.results ?? [];

      setUsers(list);
      setTotal(payload?.meta?.total ?? list.length);
    } catch (err: any) {
      notification.error({
        message: "System error",
        description: err?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // EFFECT (FIXED)
  // ======================
  useEffect(() => {
    if (status === "loading") return;

    const token = getToken();

    if (!token) return;

    fetchUsers(token);
  }, [session?.access_token, status, current, pageSize]);

  // ======================
  // TABLE COLUMNS
  // ======================
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Action",
      render: (_: any, record: IUser) => (
        <Space>
          {/* VIEW DETAIL */}
          <Button
            type="link"
            onClick={() => {
              console.log("VIEW USER:", record);
              // TODO: mở modal detail hoặc navigate
              // setDataView(record);
              // setOpenView(true);
            }}
          >
            View
          </Button>

          {/* EDIT */}
          <Button
            type="link"
            onClick={() => {
              setDataUpdate(record);
              setOpenUpdate(true);
            }}
          >
            Edit
          </Button>

          {/* DELETE */}
          <Button
            danger
            type="link"
            onClick={() => {
              setDataDelete(record);
              setOpenDelete(true);
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
        <span>Manager Users</span>

        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Create User
        </Button>
      </div>

      <Table
        bordered
        rowKey="_id"
        columns={columns}
        dataSource={users}
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

      <UserCreate
        open={openCreate}
        setOpen={setOpenCreate}
        reloadTable={() => {
          const token = getToken();
          if (token) fetchUsers(token);
        }}
      />

      <UserUpdate
        open={openUpdate}
        setOpen={setOpenUpdate}
        dataUpdate={dataUpdate}
        reloadTable={() => {
          const token = getToken();
          if (token) fetchUsers(token);
        }}
      />

      <UserDelete
        open={openDelete}
        setOpen={setOpenDelete}
        dataDelete={dataDelete}
        reloadTable={() => {
          const token = getToken();
          if (token) fetchUsers(token);
        }}
      />
    </>
  );
};

export default UserTable;
