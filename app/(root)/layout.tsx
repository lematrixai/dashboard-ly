
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { BreadcrumbProvider } from "@/components/breadcrumb-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { AuthErrorBoundary } from "@/components/auth-error-boundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthErrorBoundary>
        <AuthProvider>
          <BreadcrumbProvider>
            <SidebarProvider>
              <ProtectedRoute>
                <AppSidebar />
                <SidebarInset>
                  <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex w-full items-center justify-between px-4">
                      <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                          orientation="vertical"
                          className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <DynamicBreadcrumb />
                      </div>
                      <div className="flex items-center gap-2">
                        <ThemeToggleButton variant="circle" start="top-right" showLabel={true} />
                      </div>
                    </div>
                  </header>
                  <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                  </div>
                </SidebarInset>
              </ProtectedRoute>
            </SidebarProvider>
          </BreadcrumbProvider>
        </AuthProvider>
      </AuthErrorBoundary>
    </ThemeProvider>
  );
}
