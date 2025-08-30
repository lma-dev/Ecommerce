import { TopNavbar } from "@/app/[locale]/_components/layout/top-navbar";
import { Sidebar } from "@/app/[locale]/_components/layout/sidebar";
import SettingFloatButton from "@/app/[locale]/_components/ui/setting-floating-button";

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="hidden md:block w-64 shrink-0 border-r p-4 bg-background">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted">
          {children}
          <div>
            <SettingFloatButton />
          </div>
        </main>
      </div>
    </>
  );
}
