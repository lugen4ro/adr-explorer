import { Text, Title } from "@mantine/core";
import { Card } from "../atoms";

export interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
}

export function StatCard({ title, value, color = "blue" }: StatCardProps) {
  return (
    <Card>
      <Text size="sm" c="dimmed" fw={500}>
        {title}
      </Text>
      <Title order={2} c={color} mt="xs">
        {value}
      </Title>
    </Card>
  );
}
