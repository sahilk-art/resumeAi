"use client"

import { useState } from "react";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

type AppShellProps = {
  children: React.ReactNode;
  contentClassName?: string;
  header?: (props: { openMenu: () => void }) => React.ReactNode;
};

export function AppShell({ children, contentClassName, header }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {header ? (
          header({ openMenu: () => setMobileSidebarOpen(true) })
        ) : (
          <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
