import { type CardProps, Card as MantineCard } from "@mantine/core";

export interface AppCardProps extends CardProps {
  children: React.ReactNode;
  component?: any;
}

export function Card({
  children,
  shadow = "sm",
  padding = "lg",
  radius = "md",
  withBorder = true,
  component,
  ...props
}: AppCardProps) {
  return (
    <MantineCard
      shadow={shadow}
      padding={padding}
      radius={radius}
      withBorder={withBorder}
      component={component}
      {...props}
    >
      {children}
    </MantineCard>
  );
}
