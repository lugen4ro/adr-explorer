"use client";

import { useEffect, useState } from "react";
import { useResizable } from "@/hooks/useResizable";
import type { ADRDirectory } from "@/types/adr";
import { Sidebar as SidebarNav } from "./Navigation";

interface SidebarProps {
  directory: ADRDirectory;
  children?: React.ReactNode;
}

export function Sidebar({ directory, children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const {
    width: sidebarWidth,
    isResizing,
    startResizing,
  } = useResizable({
    minWidth: 240, // 15rem
    maxWidth: 640, // 40rem
    defaultWidth: 384, // 24rem
  });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Don't render until we have the sidebar width to prevent layout shift
  if (sidebarWidth === null) {
    return null;
  }

  return (
    <>
      <SidebarNav
        directory={directory}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        width={sidebarWidth}
        onStartResize={startResizing}
        isResizing={isResizing}
      />

      <main
        style={{
          marginLeft: isDesktop ? sidebarWidth : 0,
          width: isDesktop ? `calc(100vw - ${sidebarWidth}px)` : "100vw",
        }}
        className="lg:fixed lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto"
      >
        {children}
      </main>
    </>
  );
}
