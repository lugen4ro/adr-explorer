"use client";

import { AppShell, Burger } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import type React from "react";
import { useResizable } from "@/hooks/useResizable";
import type { ADRDirectory } from "@/types/adr";
import { Navigation } from "./Navigation";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  directory: ADRDirectory;
  children: React.ReactNode;
}

export function Layout({ directory, children }: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const { width: viewportWidth } = useViewportSize();

  const minWidth = 200;
  const maxWidth = Math.floor(viewportWidth * 0.5);
  const defaultWidth = 300;

  const { width, isResizing, startResizing } = useResizable({
    minWidth,
    maxWidth,
    defaultWidth,
  });

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: width || defaultWidth,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            mr="xl"
          />
          <Navigation />
        </div>
      </AppShell.Header>

      <Sidebar directory={directory} />

      {/* Resize handle */}
      <div
        role="slider"
        aria-label="Resize sidebar"
        aria-valuenow={width || defaultWidth}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        tabIndex={0}
        style={{
          position: "fixed",
          left: width || defaultWidth,
          top: 70,
          bottom: 0,
          width: 4,
          cursor: "col-resize",
          backgroundColor: isResizing
            ? "var(--mantine-color-blue-6)"
            : "transparent",
          zIndex: 1000,
        }}
        onMouseDown={startResizing}
      />

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
