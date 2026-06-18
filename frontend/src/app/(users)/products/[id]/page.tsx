import UsersProductDetails from "@/components/users/content/users.content.product_details";

async function getProduct(id: string) {
  if (!id) throw new Error("Missing product id");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${id}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div>Invalid product id</div>;
  }

  const data = await getProduct(id);

  return <UsersProductDetails product={data?.data} />;
}
