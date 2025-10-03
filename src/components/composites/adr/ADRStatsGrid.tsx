import { SimpleGrid } from "@mantine/core";
import { getStatusColor } from "@/lib/statusColors";
import type { ADRDirectory } from "@/types/adr";
import { StatCard } from "../../molecules";

export interface ADRStatsGridProps {
  directory: ADRDirectory;
}

export function ADRStatsGrid({ directory }: ADRStatsGridProps) {
  // Get all ADRs from directory and subdirectories
  const allADRs = [
    ...directory.adrs,
    ...directory.subdirectories.flatMap((subdir) => subdir.adrs),
  ];

  const totalADRs = allADRs.length;

  // Count all status types across all ADRs
  const statusCounts = allADRs.reduce(
    (acc, adr) => {
      const status = adr.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Get the most common statuses to display
  const statusEntries = Object.entries(statusCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4); // Show top 4 statuses

  return (
    <SimpleGrid cols={{ base: 4, sm: 4, md: 4 }} spacing="lg">
      <StatCard title="Total ADRs" value={totalADRs} color="blue" />
      {statusEntries.map(([status, count]) => {
        return (
          <StatCard
            key={status}
            title={status.charAt(0).toUpperCase() + status.slice(1)}
            value={count}
            color={getStatusColor(status)}
          />
        );
      })}
    </SimpleGrid>
  );
}
