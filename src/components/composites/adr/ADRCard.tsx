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
      <Group justify="apart" mb="xs">
        <Title order={4} lineClamp={2}>
          {adr.title}
        </Title>
        <StatusBadge status={adr.status} />
      </Group>

      {adr.category && (
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
