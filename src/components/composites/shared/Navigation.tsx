"use client";

import { AppShell } from "@mantine/core";
import { AppHeader } from "./AppHeader";

export function Navigation() {
  return (
    <AppShell.Header>
      <AppHeader />
    </AppShell.Header>
  );
}
