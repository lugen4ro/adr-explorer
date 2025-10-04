"use client";

import {
  AppShell,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useADRSearch } from "@/hooks/useADRSearch";
import { useI18n } from "@/hooks/useI18n";
import type { ADRDirectory } from "@/types/adr";
import { HighlightedText } from "../../atoms";
import { SearchBox, StatusBadge } from "../../molecules";

interface SidebarProps {
  directory: ADRDirectory;
}

export function Sidebar({ directory }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [showDates, setShowDates] = React.useState(true);
  const [wrapTitles, setWrapTitles] = React.useState(false);

  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    filteredDirectory,
    hasResults,
    resultCount,
    searchTerms,
    clearSearch,
  } = useADRSearch(directory);

  // Format date to show only YYYY-MM-DD
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) {
      return "";
    }

    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      // console.debug("Date already formatted:", dateStr);
      return dateStr;
    }

    // Try to parse and format other date formats
    try {
      const date = new Date(dateStr);
      if (!Number.isNaN(date.getTime())) {
        const formatted = date.toISOString().split("T")[0];
        console.debug("Date formatted to:", formatted);
        return formatted;
      }
    } catch {
      // If parsing fails, return original string
      console.debug("Date parsing failed, returning original:", dateStr);
    }

    return dateStr;
  };

  const renderDirectory = (dir: ADRDirectory, level = 0) => (
    <React.Fragment key={dir.path}>
      {level > 0 && (
        <div
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 10,
            backgroundColor: "var(--mantine-color-body)",
            padding: "8px 16px",
            margin: "0 -16px 8px -16px",
            borderBottom: "2px solid var(--mantine-color-blue-6)",
            width: "calc(100% + 32px)",
          }}
        >
          <Title
            order={4}
            size="md"
            c="blue"
            fw={700}
            tt="capitalize"
            style={{
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
              marginLeft: level * 16,
            }}
          >
            {dir.name}
          </Title>
        </div>
      )}

      {dir.adrs.map((adr) => {
        const expectedPath = `/adr/${adr.id}`;
        // Decode the pathname to handle URL encoding
        const decodedPathname = decodeURIComponent(pathname);
        const isActive = decodedPathname === `${expectedPath}/`;

        const href = searchQuery.trim()
          ? `/adr/${adr.id}?search=${encodeURIComponent(searchQuery.trim())}`
          : `/adr/${adr.id}`;

        return (
          <NavLink
            key={adr.id}
            component={Link}
            href={href}
            label={
              <Group
                justify="space-between"
                align="flex-start"
                wrap={wrapTitles ? "wrap" : "nowrap"}
              >
                <HighlightedText
                  text={adr.title}
                  searchTerms={searchTerms}
                  style={{ flex: 1, minWidth: 0 }}
                  truncate={!wrapTitles}
                />
                {showDates &&
                  (adr.date ? (
                    <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
                      {formatDate(adr.date)}
                    </Text>
                  ) : (
                    <Text
                      size="xs"
                      c="dimmed"
                      fs="italic"
                      style={{ flexShrink: 0 }}
                    >
                      no date
                    </Text>
                  ))}
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
              root: isActive
                ? {
                    backgroundColor: "var(--mantine-color-default-hover)",
                    "&:hover": {
                      backgroundColor: "var(--mantine-color-default-hover)",
                    },
                  }
                : undefined,
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
        <Stack gap="md">
          <Title order={4}>{t("architectureDecisions")}</Title>

          {/* Search Box */}
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={clearSearch}
            placeholder={t("search")}
          />

          {/* Search Results Counter */}
          {searchQuery.trim() && (
            <Text size="sm" c="dimmed">
              {hasResults
                ? `${resultCount} result${resultCount !== 1 ? "s" : ""} found`
                : "No results found"}
            </Text>
          )}
        </Stack>
      </AppShell.Section>

      <AppShell.Section grow component={ScrollArea} scrollbarSize={0}>
        <div style={{ marginRight: "16px" }}>
          {hasResults ? (
            renderDirectory(filteredDirectory)
          ) : (
            <Text size="sm" c="dimmed" ta="center" mt="lg">
              No ADRs match your search
            </Text>
          )}
        </div>
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
