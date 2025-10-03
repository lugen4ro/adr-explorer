import { Group, Stack, Text, Title } from "@mantine/core";
import type { ADR } from "@/types/adr";

export interface ADRHistogramProps {
  adrs: ADR[];
}

export function ADRHistogram({ adrs }: ADRHistogramProps) {
  // Group ADRs by year-month
  const monthCounts = adrs.reduce(
    (acc, adr) => {
      if (!adr.date) return acc;

      // Extract year-month from date (YYYY-MM format)
      const yearMonth = adr.date.substring(0, 7);
      acc[yearMonth] = (acc[yearMonth] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort by date and get last 12 months
  const sortedMonths = Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12);

  if (sortedMonths.length === 0) {
    return null;
  }

  const maxCount = Math.max(...sortedMonths.map(([, count]) => count));

  return (
    <Stack gap="md">
      <Title order={3}>ADR Creation Timeline</Title>
      <Group gap="xs" align="end">
        {sortedMonths.map(([month, count]) => {
          const height = Math.max((count / maxCount) * 120, 12); // Min height 12px, max 120px
          const [year, monthNum] = month.split("-");
          const monthName = new Date(
            parseInt(year, 10),
            parseInt(monthNum, 10) - 1,
          ).toLocaleDateString("en", { month: "short" });

          return (
            <Stack key={month} gap={2} align="center">
              <Text size="xs" c="dimmed">
                {count}
              </Text>
              <div
                style={{
                  width: 32,
                  height: height,
                  backgroundColor: "var(--mantine-color-blue-6)",
                  borderRadius: 4,
                }}
              />
              <Text size="xs" c="dimmed">
                {monthName}
              </Text>
              <Text size="xs" c="dimmed">
                {year.slice(-2)}
              </Text>
            </Stack>
          );
        })}
      </Group>
    </Stack>
  );
}
