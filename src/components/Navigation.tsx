"use client";

import Link from "next/link";
import React from "react";
import { useI18n } from "@/hooks/useI18n";
import type { ADRDirectory } from "@/types/adr";

interface NavigationProps {
  directory: ADRDirectory;
  onSearch?: (query: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { t, language, changeLanguage, availableLanguages } = useI18n();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              ADR Explorer
            </Link>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                🔍
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              🌓
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
