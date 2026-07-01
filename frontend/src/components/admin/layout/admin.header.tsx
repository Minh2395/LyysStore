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
import "../../../static/css/admin/admin.header.css";

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
    <Header className="admin-header">
      <Button
        className="admin-header__trigger"
        type="text"
        icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapseMenu(!collapseMenu)}
      />

      <Dropdown menu={{ items, onClick: handleMenuClick }}>
        <a className="admin-header__user" onClick={(e) => e.preventDefault()}>
          <Space>
            <span className="admin-header__username">
              Welcome {session?.user?.username || "Admin"}
            </span>
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Header>
  );
};

export default AdminHeader;
