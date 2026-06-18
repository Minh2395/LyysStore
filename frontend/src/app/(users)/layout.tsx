import UsersHeader from "@/components/users/layout/users.header";
import UsersFooter from "@/components/users/layout/users.footer";
import { CartProvider } from "@/components/users/content/users.content.cart";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <UsersHeader />
      <main>{children}</main>
      <UsersFooter />
    </CartProvider>
  );
}
