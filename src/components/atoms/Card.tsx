import { type CardProps, Card as MantineCard } from "@mantine/core";

export interface AppCardProps extends CardProps {
  children: React.ReactNode;
}

export function Card({
  children,
  shadow = "sm",
  padding = "lg",
  radius = "md",
  withBorder = true,
  ...props
}: AppCardProps) {
  return (
    <MantineCard
      shadow={shadow}
      padding={padding}
      radius={radius}
      withBorder={withBorder}
      {...props}
    >
      {children}
    </MantineCard>
  );
}
