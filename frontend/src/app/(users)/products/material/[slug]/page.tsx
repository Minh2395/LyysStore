import UsersContentMaterial from "@/components/products/content/products.content.material";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MaterialPage({ params }: Props) {
  const { slug } = await params;

  return <UsersContentMaterial slug={slug} />;
}
