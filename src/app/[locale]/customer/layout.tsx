import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const cookieStore = await cookies();
  const customerToken = cookieStore.get("customer_token")?.value;

  if (!customerToken) {
    redirect(`/${params.locale}/login`);
  }

  return <>{children}</>;
}
