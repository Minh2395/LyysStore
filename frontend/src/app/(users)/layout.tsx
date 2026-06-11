import UsersHeader from "@/components/users/layout/users.header";
import UsersFooter from "@/components/users/layout/users.footer";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UsersHeader />
      <main>{children}</main>
      <UsersFooter />
    </>
  );
}
