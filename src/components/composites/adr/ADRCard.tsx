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
    <Link
      href={`/adr/${adr.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card style={{ cursor: "pointer" }}>
        <Group gap="sm" align="flex-start" justify="space-between">
          <Group gap="sm" align="flex-start" style={{ flex: 1, minWidth: 0 }}>
            <StatusBadge status={adr.status} compact />
            <Title order={4} lineClamp={2} style={{ flex: 1 }}>
              {adr.title}
            </Title>
          </Group>
          {adr.date && (
            <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
              {adr.date}
            </Text>
          )}
        </Group>
      </Card>
    </Link>
  );
}
