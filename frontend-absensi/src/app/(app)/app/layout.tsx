import { EmployeeSidebar } from "@/components/layout/employee-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function EmployeeAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background font-sans">
        <div className="flex min-h-screen w-full">
          <EmployeeSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <AppTopbar />
            <main className="flex-1 p-6">
              <div className="mx-auto w-full max-w-5xl">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
