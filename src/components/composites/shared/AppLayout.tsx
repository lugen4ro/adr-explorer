"use client";

import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type React from "react";
import type { ADRDirectory } from "@/types/adr";
import { AppNavigation } from "./AppNavigation";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  directory: ADRDirectory;
  children: React.ReactNode;
}

export function AppLayout({ directory, children }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
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
          <AppNavigation directory={directory} />
        </div>
      </AppShell.Header>

      <AppSidebar directory={directory} />

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
