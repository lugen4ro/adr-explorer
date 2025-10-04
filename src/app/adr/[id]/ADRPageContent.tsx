"use client";

import { useSearchParams } from "next/navigation";
import type React from "react";
import { ADRRenderer } from "@/components/ADRRenderer";
import { useI18n } from "@/hooks/useI18n";
import type { ADR } from "@/types/adr";

interface ADRPageContentProps {
  adr: ADR | null;
}

export const ADRPageContent: React.FC<ADRPageContentProps> = ({ adr }) => {
  const { t } = useI18n();
  const searchParams = useSearchParams();

  // Extract search terms from URL params
  const searchQuery = searchParams.get("search") || "";
  const searchTerms = searchQuery
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0);

  if (!adr) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("adrNotFound")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("adrNotFoundMessage")}
          </p>
        </div>
      </div>
    );
  }

  return <ADRRenderer adr={adr} searchTerms={searchTerms} />;
};
