import { ActionIcon, type ActionIconProps } from "@mantine/core";

export interface AppActionButtonProps extends ActionIconProps {
  children: React.ReactNode;
  onClick?: () => void;
  "aria-label": string;
}

export function ActionButton({
  children,
  variant = "default",
  size = "md",
  ...props
}: AppActionButtonProps) {
  return (
    <ActionIcon variant={variant} size={size} {...props}>
      {children}
    </ActionIcon>
  );
}
