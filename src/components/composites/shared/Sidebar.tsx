"use client";

import {
  AppShell,
  Box,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useI18n } from "@/hooks/useI18n";
import type { ADRDirectory } from "@/types/adr";
import { StatusBadge } from "../../molecules";

interface SidebarProps {
  directory: ADRDirectory;
}

export function Sidebar({ directory }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [showDates, setShowDates] = React.useState(true);
  const [wrapTitles, setWrapTitles] = React.useState(false);

  // Format date to show only YYYY-MM-DD
  const formatDate = (dateStr?: string): string => {
    console.log("formatDate input:", dateStr);
    if (!dateStr) {
      console.log("No date provided");
      return "";
    }

    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      console.log("Date already formatted:", dateStr);
      return dateStr;
    }

    // Try to parse and format other date formats
    try {
      const date = new Date(dateStr);
      if (!Number.isNaN(date.getTime())) {
        const formatted = date.toISOString().split("T")[0];
        console.log("Date formatted to:", formatted);
        return formatted;
      }
    } catch {
      // If parsing fails, return original string
      console.log("Date parsing failed, returning original:", dateStr);
    }

    return dateStr;
  };

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
            label={
              <Group justify="space-between" align="flex-start" wrap={wrapTitles ? "wrap" : "nowrap"}>
                <Text style={{ flex: 1, minWidth: 0 }} truncate={!wrapTitles}>
                  {adr.title}
                </Text>
                {showDates && (
                  adr.date ? (
                    <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
                      {formatDate(adr.date)}
                    </Text>
                  ) : (
                    <Text size="xs" c="dimmed" fs="italic" style={{ flexShrink: 0 }}>
                      no date
                    </Text>
                  )
                )}
              </Group>
            }
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

      {/* Bottom settings section */}
      <AppShell.Section>
        <Divider mb="md" />
        <Group justify="space-between" align="center" mb="sm">
          <Group gap="xs">
            <Text size="sm">📅</Text>
            <Text size="sm">Show dates</Text>
          </Group>
          <Switch
            checked={showDates}
            onChange={(event) => setShowDates(event.currentTarget.checked)}
            size="sm"
          />
        </Group>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Text size="sm">🔄</Text>
            <Text size="sm">Wrap titles</Text>
          </Group>
          <Switch
            checked={wrapTitles}
            onChange={(event) => setWrapTitles(event.currentTarget.checked)}
            size="sm"
          />
        </Group>
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
