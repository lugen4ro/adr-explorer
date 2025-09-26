"use client";

import { AppShell } from "@mantine/core";
import React from "react";
import { useI18n } from "@/hooks/useI18n";
import type { ADRDirectory } from "@/types/adr";
import { AppHeader } from "./AppHeader";

interface AppNavigationProps {
  directory: ADRDirectory;
  onSearch?: (query: string) => void;
}

export function AppNavigation({ onSearch }: AppNavigationProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { language, changeLanguage, availableLanguages } = useI18n();

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  return (
    <AppShell.Header>
      <AppHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        language={language}
        onLanguageChange={changeLanguage}
        availableLanguages={availableLanguages}
      />
    </AppShell.Header>
  );
}
