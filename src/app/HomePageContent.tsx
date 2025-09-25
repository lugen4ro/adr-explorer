"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { HomePage } from "@/components/HomePage";
import { Navigation, Sidebar } from "@/components/Navigation";
import { useResizable } from "@/hooks/useResizable";
import type { ADRDirectory } from "@/types/adr";

interface HomePageContentProps {
  directory: ADRDirectory;
}

export const HomePageContent: React.FC<HomePageContentProps> = ({ directory }) => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation directory={directory} />

      <div>
        <Sidebar
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
          <HomePage directory={directory} />
        </main>
      </div>
    </div>
  );
};
