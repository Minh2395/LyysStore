"use client";

import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import React from "react";
import { useAdminContext } from "@/library/admin.context";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const AdminSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu } = useAdminContext();
  const pathname = usePathname();

  // map route → selected key
  const getSelectedKey = () => {
    if (pathname.includes("/dashboard/user")) return ["users"];
    if (pathname === "/dashboard") return ["dashboard"];
    return [];
  };

  const items: MenuItem[] = [
    {
      key: "grp",
      label: "Hỏi Dân IT",
      type: "group",
      children: [
        {
          key: "dashboard",
          label: <Link href="/dashboard">Dashboard</Link>,
          icon: <AppstoreOutlined />,
        },
        {
          key: "users",
          label: <Link href="/dashboard/user">Manage Users</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "sub1",
          label: "Navigation One",
          icon: <MailOutlined />,
          children: [
            {
              key: "g1",
              label: "Item 1",
              type: "group",
              children: [
                { key: "1", label: "Option 1" },
                { key: "2", label: "Option 2" },
              ],
            },
          ],
        },
        {
          key: "sub2",
          label: "Navigation Two",
          icon: <AppstoreOutlined />,
          children: [
            { key: "5", label: "Option 5" },
            { key: "6", label: "Option 6" },
          ],
        },
        {
          type: "divider",
        },
        {
          key: "sub4",
          label: "Navigation Three",
          icon: <SettingOutlined />,
          children: [
            { key: "9", label: "Option 9" },
            { key: "10", label: "Option 10" },
          ],
        },
      ],
    },
  ];

  return (
    <Sider collapsed={collapseMenu}>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={items}
        style={{ height: "100vh" }}
      />
    </Sider>
  );
};

export default AdminSideBar;
