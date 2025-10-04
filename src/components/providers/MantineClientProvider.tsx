"use client";

import { MantineProvider } from "@mantine/core";
import type { MantineTheme } from "@mantine/core";
import type { ReactNode } from "react";

interface MantineClientProviderProps {
  children: ReactNode;
  theme: MantineTheme;
}

export function MantineClientProvider({ children, theme }: MantineClientProviderProps) {
  return (
    <div suppressHydrationWarning>
      <MantineProvider theme={theme}>
        {children}
      </MantineProvider>
    </div>
  );
}