import { type BadgeProps, Badge as MantineBadge } from "@mantine/core";

export interface AppBadgeProps extends BadgeProps {
  children: React.ReactNode;
}

export function Badge({
  children,
  variant = "light",
  size = "md",
  ...props
}: AppBadgeProps) {
  return (
    <MantineBadge variant={variant} size={size} {...props}>
      {children}
    </MantineBadge>
  );
}
