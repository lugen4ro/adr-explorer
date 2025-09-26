import { type ButtonProps, Button as MantineButton } from "@mantine/core";

export interface AppButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function Button({
  children,
  variant = "filled",
  size = "md",
  ...props
}: AppButtonProps) {
  return (
    <MantineButton variant={variant} size={size} {...props}>
      {children}
    </MantineButton>
  );
}
