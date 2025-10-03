"use client";

import { Group, Title, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionButton } from "../../atoms";

export function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Group justify="space-between" p="md">
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Title order={1} size="h3">
          ADR Explorer
        </Title>
      </Link>

      <ActionButton
        onClick={() => toggleColorScheme()}
        aria-label="Toggle color scheme"
        size="lg"
      >
        {mounted ? (
          colorScheme === "dark" ? (
            <IconSun size={18} stroke={1.5} />
          ) : (
            <IconMoon size={18} stroke={1.5} />
          )
        ) : (
          <IconSun size={18} stroke={1.5} />
        )}
      </ActionButton>
    </Group>
  );
}
