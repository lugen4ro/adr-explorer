"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { ADRRenderer } from "@/components/ADRRenderer";
import { Navigation, Sidebar } from "@/components/Navigation";
import { useI18n } from "@/hooks/useI18n";
import { useResizable } from "@/hooks/useResizable";
import type { ADR, ADRDirectory } from "@/types/adr";

interface ADRPageContentProps {
  directory: ADRDirectory;
  adr: ADR | null;
}

export const ADRPageContent: React.FC<ADRPageContentProps> = ({ directory, adr }) => {
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
  const { t } = useI18n();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!adr) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation directory={directory} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("adrNotFound")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{t("adrNotFoundMessage")}</p>
          </div>
        </div>
      </div>
    );
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
          <ADRRenderer adr={adr} />
        </main>
      </div>
    </div>
  );
};
