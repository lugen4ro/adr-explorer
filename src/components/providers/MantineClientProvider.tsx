"use client";

import type { MantineThemeOverride } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";

interface MantineClientProviderProps {
  children: ReactNode;
  theme: MantineThemeOverride;
}

export function MantineClientProvider({
  children,
  theme,
}: MantineClientProviderProps) {
  return (
    <div suppressHydrationWarning>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        {children}
      </MantineProvider>
    </div>
  );
}
