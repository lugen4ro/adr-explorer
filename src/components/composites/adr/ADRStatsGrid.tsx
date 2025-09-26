import { SimpleGrid } from "@mantine/core";
import type { ADRDirectory } from "@/types/adr";
import { StatCard } from "../../molecules";

export interface ADRStatsGridProps {
  directory: ADRDirectory;
}

export function ADRStatsGrid({ directory }: ADRStatsGridProps) {
  const totalADRs =
    directory.adrs.length +
    directory.subdirectories.reduce(
      (sum, subdir) => sum + subdir.adrs.length,
      0,
    );

  const statusCounts = directory.adrs.reduce(
    (acc, adr) => {
      const status = adr.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
      <StatCard title="Total ADRs" value={totalADRs} color="blue" />
      <StatCard
        title="Categories"
        value={directory.subdirectories.length + 1}
        color="green"
      />
      <StatCard
        title="Accepted"
        value={statusCounts.accepted || 0}
        color="purple"
      />
    </SimpleGrid>
  );
}
