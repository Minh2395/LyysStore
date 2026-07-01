"use client";

import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  UserOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  PictureOutlined,
  BarChartOutlined,
  BankOutlined,
} from "@ant-design/icons";

import { useAdminContext } from "@/library/admin.context";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../../../static/css/admin/admin.sidebar.css";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const AdminSideBar = () => {
  const { collapseMenu } = useAdminContext();
  const pathname = usePathname();

  // ===== ACTIVE ROUTE HANDLER (scalable)
  const getSelectedKey = () => {
    if (pathname.startsWith("/dashboard")) return ["dashboard"];
    if (pathname.startsWith("/dashboard/users")) return ["users"];
    if (pathname.startsWith("/dashboard/categories")) return ["categories"];
    if (pathname.startsWith("/dashboard/products")) return ["products"];
    if (pathname.startsWith("/dashboard/orders")) return ["orders"];
    if (pathname.startsWith("/dashboard/branches")) return ["branches"];
    if (pathname.startsWith("/dashboard/media")) return ["media"];
    if (pathname.startsWith("/dashboard/analytics")) return ["analytics"];
    return [];
  };

  const items: MenuItem[] = [
    {
      key: "grp",
      label: "Admin Panel",
      type: "group",
      children: [
        {
          key: "dashboard",
          label: <Link href="/dashboard">Dashboard</Link>,
          icon: <AppstoreOutlined />,
        },

        // USERS
        {
          key: "users",
          label: <Link href="/dashboard/users">Users</Link>,
          icon: <UserOutlined />,
        },

        // CATEGORIES (nested)
        {
          key: "categories",
          label: <Link href="/dashboard/categories">Categories</Link>,
          icon: <TagsOutlined />,
        },

        // PRODUCTS (nested)
        {
          key: "products",
          label: <Link href="/dashboard/products">Products</Link>,
          icon: <TagsOutlined />,
        },

        // ORDERS (theo user)
        {
          key: "orders",
          label: "Orders",
          icon: <ShopOutlined />,
          children: [
            {
              key: "orders-list",
              label: <Link href="/dashboard/orders">All Orders</Link>,
            },
            {
              key: "orders-by-user",
              label: <Link href="/dashboard/orders/user">By User</Link>,
            },
          ],
        },

        // BRANCHES / STORES
        {
          key: "branches",
          label: <Link href="/dashboard/branches">Branches</Link>,
          icon: <BankOutlined />,
        },

        // MEDIA / IMAGES
        {
          key: "media",
          label: <Link href="/dashboard/media">Images & Media</Link>,
          icon: <PictureOutlined />,
        },

        // ANALYTICS
        {
          key: "analytics",
          label: <Link href="/dashboard/analytics">Statistics</Link>,
          icon: <BarChartOutlined />,
        },
      ],
    },
  ];

  return (
    <Sider className="admin-sidebar" collapsed={collapseMenu} width={260}>
      <Menu mode="inline" selectedKeys={getSelectedKey()} items={items} />
    </Sider>
  );
};

export default AdminSideBar;
