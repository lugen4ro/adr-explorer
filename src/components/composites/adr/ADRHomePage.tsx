import { Container, Stack, Title } from "@mantine/core";
import { useI18n } from "@/hooks/useI18n";
import type { ADRDirectory } from "@/types/adr";
import { ADRHistogram } from "../../molecules";
import { ADRCard, ADRStatsGrid } from "./";

export interface ADRHomePageProps {
  directory: ADRDirectory;
}

export function ADRHomePage({ directory }: ADRHomePageProps) {
  const { t } = useI18n();

  // Get all ADRs from directory and subdirectories, then sort by date
  const allADRs = [
    ...directory.adrs,
    ...directory.subdirectories.flatMap((subdir) => subdir.adrs),
  ];

  const recentADRs = allADRs
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);

  return (
    <Container size="xl" p="md">
      <Stack gap="xl">
        {/* Hero Section */}
        <Stack align="center" gap="md" py="xl">
          <Title order={1} size="h1" ta="center">
            {t("architectureDecisions")}
          </Title>
        </Stack>

        {/* Stats Grid */}
        <Stack gap="md">
          <Title order={2}>Overview</Title>
          <ADRStatsGrid directory={directory} />
        </Stack>

        {/* ADR Creation Timeline */}
        <ADRHistogram adrs={allADRs} />

        {/* Recent ADRs */}
        {recentADRs.length > 0 && (
          <Stack gap="md">
            <Title order={2}>Recent ADRs</Title>
            <Stack gap="sm">
              {recentADRs.map((adr) => (
                <ADRCard key={adr.id} adr={adr} />
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
