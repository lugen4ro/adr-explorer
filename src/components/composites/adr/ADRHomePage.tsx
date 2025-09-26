import {
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useI18n } from "@/hooks/useI18n";
import type { ADRDirectory } from "@/types/adr";
import { Card } from "../../atoms";
import { ADRCard, ADRStatsGrid } from "./";

export interface ADRHomePageProps {
  directory: ADRDirectory;
}

export function ADRHomePage({ directory }: ADRHomePageProps) {
  const { t } = useI18n();

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
    <Container size="xl" p="md">
      <Stack gap="xl">
        {/* Hero Section */}
        <Stack align="center" gap="md" py="xl">
          <Title order={1} size="h1" ta="center">
            {t("architectureDecisions")}
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            Explore and understand the architectural decisions that shape this
            project. Each ADR documents important choices, their context, and
            consequences.
          </Text>
        </Stack>

        {/* Stats Grid */}
        <ADRStatsGrid directory={directory} />

        {/* Recent Decisions */}
        {recentADRs.length > 0 && (
          <Stack gap="md">
            <Title order={2}>{t("recentDecisions")}</Title>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {recentADRs.map((adr) => (
                <ADRCard key={adr.id} adr={adr} />
              ))}
            </SimpleGrid>
          </Stack>
        )}

        {/* Categories and Status Overview */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {/* Categories */}
          <Stack gap="md">
            <Title order={2}>{t("browseBycategory")}</Title>
            <Stack gap="sm">
              {directory.subdirectories.map((subdir) => (
                <Card key={subdir.name} p="md">
                  <Title order={4} size="h5" tt="capitalize" mb="xs">
                    {subdir.name}
                  </Title>
                  <Text size="sm" c="dimmed" mb="sm">
                    {subdir.adrs.length} decision
                    {subdir.adrs.length !== 1 ? "s" : ""}
                  </Text>
                  <Stack gap="xs">
                    {subdir.adrs.slice(0, 3).map((adr) => (
                      <Text
                        key={adr.id}
                        component={Link}
                        href={`/adr/${adr.id}`}
                        size="sm"
                        c="blue"
                        style={{ textDecoration: "none" }}
                      >
                        {adr.title}
                      </Text>
                    ))}
                    {subdir.adrs.length > 3 && (
                      <Text size="xs" c="dimmed">
                        +{subdir.adrs.length - 3} more...
                      </Text>
                    )}
                  </Stack>
                </Card>
              ))}

              {/* General ADRs */}
              {directory.adrs.length > 0 && (
                <Card p="md">
                  <Title order={4} size="h5" mb="xs">
                    {t("general")}
                  </Title>
                  <Text size="sm" c="dimmed" mb="sm">
                    {directory.adrs.length} decision
                    {directory.adrs.length !== 1 ? "s" : ""}
                  </Text>
                  <Stack gap="xs">
                    {directory.adrs.slice(0, 3).map((adr) => (
                      <Text
                        key={adr.id}
                        component={Link}
                        href={`/adr/${adr.id}`}
                        size="sm"
                        c="blue"
                        style={{ textDecoration: "none" }}
                      >
                        {adr.title}
                      </Text>
                    ))}
                    {directory.adrs.length > 3 && (
                      <Text size="xs" c="dimmed">
                        +{directory.adrs.length - 3} more...
                      </Text>
                    )}
                  </Stack>
                </Card>
              )}
            </Stack>
          </Stack>

          {/* Decision Status */}
          <Stack gap="md">
            <Title order={2}>{t("decisionStatus")}</Title>
            <Stack gap="sm">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Card key={status} p="md">
                  <Group justify="apart">
                    <Text tt="capitalize" fw={500}>
                      {status}
                    </Text>
                    <Title order={3} c="dimmed">
                      {count}
                    </Title>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
