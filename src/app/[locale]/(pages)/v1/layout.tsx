import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TopNavbar } from "@/app/[locale]/_components/layout/top-navbar";
import { Sidebar } from "@/app/[locale]/_components/layout/sidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const jar = await cookies();
  const adminSession =
    jar.get("next-auth.session-token")?.value ||
    jar.get("__Secure-next-auth.session-token")?.value ||
    jar.get("auth_token")?.value;

  if (!adminSession) {
    redirect(`/${params.locale}/login?type=console`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="hidden md:block w-64 shrink-0 border-r p-4 bg-background">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
