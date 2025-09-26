"use client";

import { AppShell, NavLink, ScrollArea, Title } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useI18n } from "@/hooks/useI18n";
import type { ADRDirectory } from "@/types/adr";
import { StatusBadge } from "../../molecules";

interface AppSidebarProps {
  directory: ADRDirectory;
}

export function AppSidebar({ directory }: AppSidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  const renderDirectory = (dir: ADRDirectory, level = 0) => (
    <React.Fragment key={dir.path}>
      {level > 0 && (
        <Title order={5} size="sm" c="dimmed" mb="xs" ml={level * 16}>
          {dir.name}
        </Title>
      )}

      {dir.adrs.map((adr) => {
        const expectedPath = `/adr/${adr.id}`;
        const isActive =
          pathname === expectedPath || pathname === `${expectedPath}/`;

        return (
          <NavLink
            key={adr.id}
            component={Link}
            href={`/adr/${adr.id}`}
            label={adr.title}
            leftSection={<StatusBadge status={adr.status} compact />}
            active={isActive}
            ml={level * 16}
            variant={isActive ? "light" : "subtle"}
            styles={{
              section: {
                alignSelf: "flex-start",
                marginTop: "5px",
              },
            }}
          />
        );
      })}

      {dir.subdirectories.map((subdir) => renderDirectory(subdir, level + 1))}
    </React.Fragment>
  );

  return (
    <AppShell.Navbar p="md">
      <AppShell.Section>
        <Title order={4} mb="md">
          {t("architectureDecisions")}
        </Title>
      </AppShell.Section>

      <AppShell.Section grow component={ScrollArea}>
        {renderDirectory(directory)}
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
