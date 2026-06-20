import UsersContentCollections from "@/components/products/content/products.content.collection";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollectionsPage({ params }: Props) {
  const { slug } = await params;

  return <UsersContentCollections slug={slug} />;
}
