"use client";

import { useAdminContext } from "@/library/admin.context";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Layout, Dropdown, Space } from "antd";
import { useContext } from "react";
import { signOut, useSession } from "next-auth/react";
import type { MenuProps } from "antd";

const AdminHeader = () => {
  const { Header } = Layout;
  const { collapseMenu, setCollapseMenu } = useAdminContext();

  const { data: session } = useSession();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      signOut({ callbackUrl: "/auth/login" });
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "settings",
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      danger: true,
      label: "Đăng xuất",
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        display: "flex",
        background: "#f5f5f5",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        type="text"
        icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapseMenu(!collapseMenu)}
        style={{
          fontSize: 16,
          width: 64,
          height: 64,
        }}
      />

      <Dropdown menu={{ items, onClick: handleMenuClick }}>
        <a
          onClick={(e) => e.preventDefault()}
          style={{
            color: "inherit",
            marginRight: 20,
          }}
        >
          <Space>
            Welcome {session?.user?.username || "Admin"}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Header>
  );
};

export default AdminHeader;
