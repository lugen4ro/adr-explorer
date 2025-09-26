import { Group, Text, Title } from "@mantine/core";
import Link from "next/link";
import type { ADR } from "@/types/adr";
import { Card } from "../../atoms";
import { StatusBadge } from "../../molecules";

export interface ADRCardProps {
  adr: ADR;
}

export function ADRCard({ adr }: ADRCardProps) {
  return (
    <Card
      component={Link}
      style={{ cursor: "pointer" }}
      {...({ href: `/adr/${adr.id}` } as any)}
    >
      <Group gap="sm" mb="xs" align="flex-start">
        <StatusBadge status={adr.status} compact />
        <Title order={4} lineClamp={2} style={{ flex: 1 }}>
          {adr.title}
        </Title>
      </Group>

      {adr.category && adr.category.toLowerCase() !== "adr" && (
        <Text size="sm" c="dimmed" mb="xs">
          {adr.category}
        </Text>
      )}

      {adr.date && (
        <Text size="xs" c="dimmed">
          {adr.date}
        </Text>
      )}
    </Card>
  );
}
