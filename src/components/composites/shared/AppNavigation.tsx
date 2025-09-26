"use client";

import { AppShell } from "@mantine/core";
import type { ADRDirectory } from "@/types/adr";
import { AppHeader } from "./AppHeader";

interface AppNavigationProps {
  directory: ADRDirectory;
  onSearch?: (query: string) => void;
}

export function AppNavigation({}: AppNavigationProps) {
  return (
    <AppShell.Header>
      <AppHeader />
    </AppShell.Header>
  );
}
