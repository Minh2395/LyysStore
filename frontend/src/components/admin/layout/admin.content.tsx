"use client";

import { Layout } from "antd";
import "../../../static/css/admin/admin.content.css";

const AdminContent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { Content } = Layout;

  return (
    <Content className="admin-content">
      <div className="admin-content__wrapper">{children}</div>
    </Content>
  );
};

export default AdminContent;
