import UserDetailClient from "./UserDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailUser({ params }: PageProps) {
  const { id } = await params;
  return <UserDetailClient id={Number(id)} />;
}
