"use client";

import Link from "next/link";
import type React from "react";
import { useI18n } from "@/hooks/useI18n";
import type { ADRDirectory } from "@/types/adr";

interface HomePageProps {
  directory: ADRDirectory;
}

export const HomePage: React.FC<HomePageProps> = ({ directory }) => {
  const { t } = useI18n();
  const totalADRs =
    directory.adrs.length +
    directory.subdirectories.reduce((sum, subdir) => sum + subdir.adrs.length, 0);

  const recentADRs = directory.adrs
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);

  const statusCounts = directory.adrs.reduce(
    (acc, adr) => {
      const status = adr.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="max-w-7xl px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("architectureDecisions")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          Explore and understand the architectural decisions that shape this project. Each ADR
          documents important choices, their context, and consequences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t("totalAdrs")}
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalADRs}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t("categories")}
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {directory.subdirectories.length + 1}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t("accepted")}
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {statusCounts.accepted || 0}
          </p>
        </div>
      </div>

      {recentADRs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("recentDecisions")}
          </h2>
          <div className="grid gap-4">
            {recentADRs.map((adr) => (
              <Link
                key={adr.id}
                href={`/adr/${adr.id}`}
                className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {adr.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      adr.status.toLowerCase() === "accepted"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : adr.status.toLowerCase() === "rejected"
                          ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    }`}
                  >
                    {adr.status}
                  </span>
                </div>
                {adr.category && (
                  <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs mb-2">
                    {adr.category}
                  </span>
                )}
                {adr.date && <p className="text-sm text-gray-500 dark:text-gray-400">{adr.date}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("browseBycategory")}
          </h2>
          <div className="space-y-4">
            {directory.subdirectories.map((subdir) => (
              <div key={subdir.name} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-gray-900 dark:text-white capitalize mb-2">
                  {subdir.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {subdir.adrs.length} decision
                  {subdir.adrs.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-1">
                  {subdir.adrs.slice(0, 3).map((adr) => (
                    <Link
                      key={adr.id}
                      href={`/adr/${adr.id}`}
                      className="block text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {adr.title}
                    </Link>
                  ))}
                  {subdir.adrs.length > 3 && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      +{subdir.adrs.length - 3} more...
                    </p>
                  )}
                </div>
              </div>
            ))}

            {directory.adrs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t("general")}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {directory.adrs.length} decision
                  {directory.adrs.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-1">
                  {directory.adrs.slice(0, 3).map((adr) => (
                    <Link
                      key={adr.id}
                      href={`/adr/${adr.id}`}
                      className="block text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {adr.title}
                    </Link>
                  ))}
                  {directory.adrs.length > 3 && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      +{directory.adrs.length - 3} more...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("decisionStatus")}
          </h2>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <span className="capitalize font-medium text-gray-900 dark:text-white">
                    {status}
                  </span>
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
