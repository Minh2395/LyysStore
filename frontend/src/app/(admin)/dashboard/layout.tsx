import AdminContent from "@/components/admin/layout/admin.content";
import AdminFooter from "@/components/admin/layout/admin.footer";
import AdminHeader from "@/components/admin/layout/admin.header";
import AdminSideBar from "@/components/admin/layout/admin.sidebar";
import { AdminContextProvider } from "@/library/admin.context";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AdminContextProvider>
      <div style={{ display: "flex" }}>
        <div className="left-side" style={{ minWidth: 80 }}>
          <AdminSideBar />
        </div>

        <div className="right-side" style={{ flex: 1 }}>
          <AdminHeader />
          <AdminContent>{children}</AdminContent>
          <AdminFooter />
        </div>
      </div>
    </AdminContextProvider>
  );
};

export default AdminLayout;
