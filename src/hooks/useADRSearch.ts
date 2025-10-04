"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchService } from "@/services/searchService";
import type { ADRDirectory } from "@/types/adr";

interface UseADRSearchOptions {
  debounceMs?: number;
}

interface UseADRSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredDirectory: ADRDirectory;
  isSearching: boolean;
  clearSearch: () => void;
  hasResults: boolean;
  resultCount: number;
  searchTerms: string[];
}

/**
 * Custom hook for managing ADR search state and functionality.
 *
 * Provides debounced search functionality to filter ADRs based on text queries.
 * Maintains search state and returns filtered directory structure.
 *
 * @param directory - The original ADR directory structure to search
 * @param options - Configuration options for the search behavior
 * @returns Search state and control functions
 */
export function useADRSearch(
  directory: ADRDirectory,
  options: UseADRSearchOptions = {},
): UseADRSearchReturn {
  const { debounceMs = 300 } = options;

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Create search service instance
  const searchService = useMemo(() => new SearchService(), []);

  // Debounce the search query
  useEffect(() => {
    setIsSearching(true);

    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, debounceMs]);

  // Perform the search when debounced query changes
  const filteredDirectory = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return directory;
    }

    return searchService.searchADRs(directory, debouncedQuery);
  }, [directory, debouncedQuery, searchService]);

  // Calculate result metrics
  const resultCount = useMemo(() => {
    return searchService.countADRs(filteredDirectory);
  }, [filteredDirectory, searchService]);

  const hasResults = useMemo(() => {
    return !debouncedQuery.trim() || resultCount > 0;
  }, [debouncedQuery, resultCount]);

  // Extract search terms for highlighting
  const searchTerms = useMemo(() => {
    return debouncedQuery
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0);
  }, [debouncedQuery]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredDirectory,
    isSearching,
    clearSearch,
    hasResults,
    resultCount,
    searchTerms,
  };
}
