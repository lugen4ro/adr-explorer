"use client";

import { AppShell } from "@mantine/core";
import { AppHeader } from "./AppHeader";

export function AppNavigation() {
  return (
    <AppShell.Header>
      <AppHeader />
    </AppShell.Header>
  );
}
