"use client";

import { AppShell } from "@mantine/core";
import { Header } from "./Header";

export function Navigation() {
  return (
    <AppShell.Header>
      <Header />
    </AppShell.Header>
  );
}
