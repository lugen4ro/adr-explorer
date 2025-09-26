import {
  TextInput as MantineTextInput,
  type TextInputProps,
} from "@mantine/core";

export interface AppTextInputProps extends TextInputProps {
  placeholder?: string;
}

export function TextInput({
  size = "md",
  variant = "default",
  ...props
}: AppTextInputProps) {
  return <MantineTextInput size={size} variant={variant} {...props} />;
}
