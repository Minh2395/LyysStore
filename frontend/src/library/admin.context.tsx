"use client";

import { createContext, useContext, useState } from "react";

interface IAdminContext {
  collapseMenu: boolean;
  setCollapseMenu: (v: boolean) => void;
}

const AdminContext = createContext<IAdminContext | undefined>(undefined);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapseMenu, setCollapseMenu] = useState(false);

  return (
    <AdminContext.Provider value={{ collapseMenu, setCollapseMenu }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = (): IAdminContext => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdminContext must be used within AdminContextProvider");
  }

  return context;
};
