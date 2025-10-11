import CategoryDetailClient from "./CategoryDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailCategory({ params }: PageProps) {
  const { id } = await params;
  return <CategoryDetailClient id={Number(id)} />;
}
