import { Select as MantineSelect, type SelectProps } from "@mantine/core";

export interface AppSelectProps extends SelectProps {
  data: string[] | { value: string; label: string }[];
}

export function Select({
  size = "md",
  variant = "default",
  ...props
}: AppSelectProps) {
  return <MantineSelect size={size} variant={variant} {...props} />;
}
