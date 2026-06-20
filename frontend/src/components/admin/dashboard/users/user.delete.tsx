"use client";

import { Modal, notification, Button } from "antd";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";

interface IUser {
  _id: string;
  name: string;
}

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  reloadTable?: () => void;
  dataDelete: IUser | null;
}

const UserDelete = ({ open, setOpen, reloadTable, dataDelete }: IProps) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const getToken = () => session?.access_token;

  const handleDelete = async () => {
    const token = getToken();

    if (!token) {
      notification.error({
        message: "Missing token",
      });
      return;
    }

    if (!dataDelete?._id) {
      notification.error({
        message: "Missing user",
      });
      return;
    }

    try {
      setLoading(true);

      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${dataDelete._id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notification.success({
        message: "Delete success",
        description: `User ${dataDelete.name} has been deleted`,
      });

      setOpen(false);
      reloadTable?.();
    } catch (err: any) {
      notification.error({
        message: "Delete failed",
        description: err?.message || "Cannot delete user",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete User"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        Are you sure you want to delete user:
        <b> {dataDelete?.name}</b>?
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Button onClick={() => setOpen(false)} style={{ flex: 1 }}>
          Cancel
        </Button>

        <Button
          danger
          type="primary"
          loading={loading}
          onClick={handleDelete}
          style={{ flex: 1 }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default UserDelete;
