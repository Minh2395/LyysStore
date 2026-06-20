import UsersContentShape from "@/components/products/content/products.content.shape";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ShapePage({ params }: Props) {
  const { slug } = await params;

  return <UsersContentShape slug={slug} />;
}
