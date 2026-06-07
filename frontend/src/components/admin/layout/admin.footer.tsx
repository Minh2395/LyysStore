"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;

  const currentYear = new Date().getFullYear();

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        LyysStore ©{currentYear} Created by @lyysstore
      </Footer>
    </>
  );
};

export default AdminFooter;
