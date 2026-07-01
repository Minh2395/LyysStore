"use client";

import AdminContent from "@/components/admin/layout/admin.content";
import AdminFooter from "@/components/admin/layout/admin.footer";
import AdminHeader from "@/components/admin/layout/admin.header";
import AdminSideBar from "@/components/admin/layout/admin.sidebar";
import { AdminContextProvider, useAdminContext } from "@/library/admin.context";

import "@/static/css/admin/admin.layout.css";

const AdminLayoutContent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { collapseMenu } = useAdminContext();

  return (
    <div className="admin-layout">
      <div
        className={`admin-layout__sidebar ${collapseMenu ? "collapsed" : ""}`}
      >
        <AdminSideBar />
      </div>

      <div className={`admin-layout__main ${collapseMenu ? "collapsed" : ""}`}>
        <AdminHeader />
        <AdminContent>{children}</AdminContent>
        <AdminFooter />
      </div>
    </div>
  );
};

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AdminContextProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminContextProvider>
  );
};

export default AdminLayout;
