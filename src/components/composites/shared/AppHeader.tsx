"use client";

import { Group, Title, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionButton } from "../../atoms";
import { LanguageSelector, SearchBox } from "../../molecules";

export interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch?: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
  availableLanguages: string[];
}

export function AppHeader({
  searchQuery,
  onSearchChange,
  onSearch,
  language,
  onLanguageChange,
  availableLanguages,
}: AppHeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Group justify="apart" p="md">
      <Title
        order={1}
        size="h3"
        component={Link}
        style={{ textDecoration: "none", color: "inherit" }}
        {...({ href: "/" } as any)}
      >
        ADR Explorer
      </Title>

      <Group style={{ flex: 1, maxWidth: 400 }}>
        <SearchBox
          value={searchQuery}
          onChange={onSearchChange}
          onSubmit={onSearch}
          placeholder="Search ADRs..."
        />
      </Group>

      <Group gap="sm">
        <LanguageSelector
          value={language}
          onChange={onLanguageChange}
          languages={availableLanguages}
        />
        <ActionButton
          onClick={() => toggleColorScheme()}
          aria-label="Toggle color scheme"
          size="lg"
        >
          {mounted ? (
            colorScheme === "dark" ? (
              <IconSun size={18} stroke={1.5} />
            ) : (
              <IconMoon size={18} stroke={1.5} />
            )
          ) : (
            <IconSun size={18} stroke={1.5} />
          )}
        </ActionButton>
      </Group>
    </Group>
  );
}
