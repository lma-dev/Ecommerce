import ProductDetailClient from "./ProductDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailProduct({ params }: PageProps) {
  const { id } = await params;
  return <ProductDetailClient id={Number(id)} />;
}
