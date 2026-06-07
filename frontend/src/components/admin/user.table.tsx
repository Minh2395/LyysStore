"use client";

import { useEffect, useState } from "react";
import { Button, Space, Table, notification } from "antd";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import UserCreate from "./user.create";
import UserUpdate from "./user.update";

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

interface IUserListResponse {
  results: IUser[];
  meta: {
    total: number;
  };
}

const UserTable = () => {
  const { data: session } = useSession();

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IUser | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // ======================
  // FETCH USERS
  // ======================
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const accessToken = (session?.user as any)?.access_token;

      const res = await sendRequest<IBackendRes<IUserListResponse>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "GET",
        queryParams: {
          current,
          pageSize,
        },
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
      });

      if (res?.data) {
        setUsers(res.data.results);
        setTotal(res.data.meta.total);
      } else {
        notification.error({
          message: "Error",
          description: res?.message || "Fetch users failed",
        });
      }
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
  // EFFECT
  // ======================
  useEffect(() => {
    if ((session?.user as any)?.access_token) {
      fetchUsers();
    }
  }, [session, current, pageSize]);

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
      title: "Action",
      render: (_: any, record: IUser) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setDataUpdate(record);
              setOpenUpdate(true);
            }}
          >
            Edit
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
        reloadTable={fetchUsers}
      />

      <UserUpdate
        open={openUpdate}
        setOpen={setOpenUpdate}
        dataUpdate={dataUpdate}
        reloadTable={fetchUsers}
      />
    </>
  );
};

export default UserTable;
